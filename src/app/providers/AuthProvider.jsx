import { useCallback, useEffect, useMemo, useState } from 'react';
import { APPROVAL_STATUS } from '../../constants/options';
import { authService, profileCompletion } from '../../services/auth.service';
import { approvalService } from '../../services/approval.service';
import { AuthContext } from './AuthContext';

/**
 * Owns the authenticated user for the whole application.
 *
 * `isBootstrapping` exists so guarded routes can wait for the persisted
 * session to resolve instead of bouncing a signed-in user to /login on
 * first paint.
 */
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isBootstrapping, setIsBootstrapping] = useState(true);

	useEffect(() => {
		let isActive = true;

		authService
			.getCurrentUser()
			.then((current) => {
				if (isActive) setUser(current);
			})
			.catch(() => {
				if (isActive) setUser(null);
			})
			.finally(() => {
				if (isActive) setIsBootstrapping(false);
			});

		return () => {
			isActive = false;
		};
	}, []);

	const login = useCallback(async (credentials) => {
		const authenticated = await authService.login(credentials);
		setUser(authenticated);
		return authenticated;
	}, []);

	const register = useCallback(async (details) => {
		const created = await authService.register(details);
		setUser(created);
		return created;
	}, []);

	const logout = useCallback(async () => {
		await authService.logout();
		setUser(null);
	}, []);

	const updateProfile = useCallback(
		async (patch, options) => {
			if (!user) throw new Error('You need to be signed in to do that.');
			const updated = await authService.updateProfile(user.id, patch, options);
			setUser(updated);
			return updated;
		},
		[user],
	);

	const changePassword = useCallback(
		async (payload) => {
			if (!user) throw new Error('You need to be signed in to do that.');
			return authService.changePassword(user.id, payload);
		},
		[user],
	);

	/**
	 * Re-reads the signed-in user straight from storage.
	 * The awaiting-approval watcher calls this when it sees an admin decision
	 * land in another tab; updating `user` here is what makes the route guard
	 * move the member off the waiting screen on its own.
	 */
	// Read out of the object so the dependency is a plain value; the compiler
	// cannot preserve memoization across an optional chain in a dep array.
	const userId = user?.id ?? null;

	const refreshUser = useCallback(() => {
		if (!userId) return null;
		const fresh = authService.refreshUserById(userId);
		if (fresh) setUser(fresh);
		return fresh;
	}, [userId]);

	/** A declined member retakes their photo and re-enters the queue. */
	const resubmitVerification = useCallback(
		async (photoDataUrl) => {
			if (!user) throw new Error('You need to be signed in to do that.');
			const updated = await approvalService.resubmit(user.id, photoDataUrl);
			setUser(updated);
			return updated;
		},
		[user],
	);

	const value = useMemo(
		() => ({
			user,
			isAuthenticated: Boolean(user),
			isBootstrapping,
			role: user?.role ?? null,
			approvalStatus: user?.approvalStatus ?? APPROVAL_STATUS.NOT_REQUIRED,
			completion: profileCompletion(user),
			login,
			register,
			logout,
			updateProfile,
			changePassword,
			refreshUser,
			resubmitVerification,
		}),
		[
			changePassword,
			isBootstrapping,
			login,
			logout,
			refreshUser,
			register,
			resubmitVerification,
			updateProfile,
			user,
		],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
