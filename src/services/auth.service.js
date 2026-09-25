import { APPROVAL_STATUS } from '../constants/options';
import { ROLES, requiresApproval } from '../constants/roles';
import { storage, STORAGE_KEYS } from '../lib/storage';
import { ApiError, createId, request } from './mockClient';
import {
	digest,
	findUserByEmail,
	findUserById,
	insertUser,
	toPublicUser,
	updateUserById,
} from './userStore';

/**
 * Mock identity service.
 *
 * NOTE: credentials are never verified in the browser in a real deployment.
 * This module exists so the UI can be built and demoed end-to-end; when the
 * API lands, each function below becomes an HTTP call with the same signature.
 * All reads and writes go through `userStore` so the approval flow has a
 * single source of truth.
 */

const emptyProfileFor = (role) => {
	const base = {
		headline: '',
		bio: '',
		location: '',
		phone: '',
		linkedin: '',
		avatarUrl: '',
	};

	if (role === ROLES.COMPANY) {
		return {
			...base,
			companyName: '',
			industry: '',
			companySize: '',
			website: '',
			hiringFocus: [],
		};
	}

	if (role === ROLES.MENTOR) {
		return {
			...base,
			title: '',
			company: '',
			track: '',
			level: '',
			yearsExperience: '',
			skills: [],
			focusAreas: [],
			capacity: '2',
		};
	}

	return {
		...base,
		title: '',
		company: '',
		track: '',
		level: '',
		yearsExperience: '',
		skills: [],
		goals: [],
		availability: '',
		openToRelocation: false,
	};
};

/** Percentage of profile fields completed — drives the dashboard nudge. */
export const profileCompletion = (user) => {
	if (!user) return 0;
	if (user.role === ROLES.ADMIN) return 100;

	const profile = user.profile ?? {};
	const required =
		user.role === ROLES.COMPANY
			? ['companyName', 'industry', 'companySize', 'location', 'bio', 'website']
			: user.role === ROLES.MENTOR
				? ['title', 'company', 'track', 'level', 'yearsExperience', 'bio', 'skills', 'focusAreas']
				: ['title', 'company', 'track', 'level', 'yearsExperience', 'bio', 'skills', 'goals'];

	const filled = required.filter((field) => {
		const value = profile[field];
		return Array.isArray(value) ? value.length > 0 : Boolean(value);
	});

	return Math.round((filled.length / required.length) * 100);
};

export const authService = {
	/** Reads the persisted session on app boot. */
	getCurrentUser: () =>
		request(() => {
			const session = storage.get(STORAGE_KEYS.session);
			if (!session?.userId) return null;
			return toPublicUser(findUserById(session.userId));
		}, { delay: 120 }),

	/**
	 * Re-reads one specific user straight from storage, synchronously.
	 *
	 * Takes an explicit id rather than following the session on purpose: the
	 * session is a single shared localStorage key, so when an admin signs in
	 * from a second tab of the same browser it overwrites the member's session.
	 * The waiting tab must keep refreshing the account it is actually showing,
	 * not whoever logged in last.
	 */
	refreshUserById: (userId) => {
		if (!userId) return null;
		return toPublicUser(findUserById(userId));
	},

	register: ({ name, email, password, role, photoDataUrl }) =>
		request(() => {
			const normalisedEmail = String(email).trim().toLowerCase();

			// Guards against a second account on the same email — including an
			// already-approved member re-entering the signup flow.
			if (findUserByEmail(normalisedEmail)) {
				throw new ApiError('An account already exists for this email address.', {
					status: 409,
					fieldErrors: { email: 'This email is already registered' },
				});
			}

			const gated = requiresApproval(role);

			if (gated && !photoDataUrl) {
				throw new ApiError('A live photo capture is required to create this account.', {
					status: 422,
					fieldErrors: { photoDataUrl: 'Capture a live photo to continue' },
				});
			}

			const user = {
				id: createId('usr'),
				name: String(name).trim(),
				email: normalisedEmail,
				role,
				passwordDigest: digest(password),
				approvalStatus: gated
					? APPROVAL_STATUS.PENDING
					: APPROVAL_STATUS.NOT_REQUIRED,
				photoDataUrl: gated ? photoDataUrl : undefined,
				signupAt: new Date().toISOString(),
				onboardingComplete: false,
				createdAt: new Date().toISOString(),
				profile: emptyProfileFor(role),
			};

			insertUser(user);
			storage.set(STORAGE_KEYS.session, { userId: user.id });

			return toPublicUser(user);
		}),

	login: ({ email, password }) =>
		request(() => {
			const user = findUserByEmail(email);

			if (!user || user.passwordDigest !== digest(password)) {
				throw new ApiError('That email and password combination is not recognised.', {
					status: 401,
				});
			}

			storage.set(STORAGE_KEYS.session, { userId: user.id });
			return toPublicUser(user);
		}),

	logout: () =>
		request(() => {
			storage.remove(STORAGE_KEYS.session);
			return true;
		}, { delay: 120 }),

	/** Patches the profile object and optionally flips the onboarding flag. */
	updateProfile: (userId, patch, { completeOnboarding = false } = {}) =>
		request(() => {
			const existing = findUserById(userId);
			if (!existing) {
				throw new ApiError('Your session has expired. Please log in again.', {
					status: 401,
				});
			}

			const { name, ...profilePatch } = patch;

			const updated = updateUserById(userId, {
				name: name?.trim() || existing.name,
				onboardingComplete: completeOnboarding || existing.onboardingComplete,
				profile: { ...existing.profile, ...profilePatch },
			});

			return toPublicUser(updated);
		}),

	changePassword: (userId, { currentPassword, newPassword }) =>
		request(() => {
			const user = findUserById(userId);

			if (!user) {
				throw new ApiError('Your session has expired. Please log in again.', {
					status: 401,
				});
			}

			if (user.passwordDigest !== digest(currentPassword)) {
				throw new ApiError('Your current password is incorrect.', {
					status: 403,
					fieldErrors: { currentPassword: 'Incorrect password' },
				});
			}

			updateUserById(userId, { passwordDigest: digest(newPassword) });
			return true;
		}),
};
