import { useCallback, useEffect, useMemo, useState } from 'react';
import { authService, profileCompletion } from '../../services/auth.service';
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

	const value = useMemo(
		() => ({
			user,
			isAuthenticated: Boolean(user),
			isBootstrapping,
			role: user?.role ?? null,
			completion: profileCompletion(user),
			login,
			register,
			logout,
			updateProfile,
			changePassword,
		}),
		[changePassword, isBootstrapping, login, logout, register, updateProfile, user],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
