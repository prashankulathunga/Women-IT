import { ROLES } from '../constants/roles';
import { storage, STORAGE_KEYS } from '../lib/storage';
import { ApiError, createId, request } from './mockClient';

/**
 * Mock identity service.
 *
 * NOTE: credentials are never verified in the browser in a real deployment.
 * This module exists so the UI can be built and demoed end-to-end; when the
 * API lands, each function below becomes an HTTP call with the same signature.
 * Passwords are digested rather than stored verbatim purely so that a demo
 * database never contains readable secrets.
 */

const digest = (value) => {
	let hash = 0;
	for (let index = 0; index < value.length; index += 1) {
		hash = (hash << 5) - hash + value.charCodeAt(index);
		hash |= 0;
	}
	return `d${Math.abs(hash).toString(36)}`;
};

const readUsers = () => storage.get(STORAGE_KEYS.users, []);
const writeUsers = (users) => storage.set(STORAGE_KEYS.users, users);

/** Strips the credential digest before a record leaves the service. */
const publicUser = (user) => {
	const safe = { ...user };
	delete safe.passwordDigest;
	return safe;
};

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

			const user = readUsers().find((item) => item.id === session.userId);
			return user ? publicUser(user) : null;
		}, { delay: 120 }),

	register: ({ name, email, password, role }) =>
		request(() => {
			const users = readUsers();
			const normalisedEmail = String(email).trim().toLowerCase();

			if (users.some((user) => user.email === normalisedEmail)) {
				throw new ApiError('An account already exists for this email address.', {
					status: 409,
					fieldErrors: { email: 'This email is already registered' },
				});
			}

			const user = {
				id: createId('usr'),
				name: String(name).trim(),
				email: normalisedEmail,
				role,
				passwordDigest: digest(password),
				onboardingComplete: false,
				createdAt: new Date().toISOString(),
				profile: emptyProfileFor(role),
			};

			writeUsers([...users, user]);
			storage.set(STORAGE_KEYS.session, { userId: user.id });

			return publicUser(user);
		}),

	login: ({ email, password }) =>
		request(() => {
			const normalisedEmail = String(email).trim().toLowerCase();
			const user = readUsers().find((item) => item.email === normalisedEmail);

			if (!user || user.passwordDigest !== digest(password)) {
				throw new ApiError('That email and password combination is not recognised.', {
					status: 401,
				});
			}

			storage.set(STORAGE_KEYS.session, { userId: user.id });
			return publicUser(user);
		}),

	logout: () =>
		request(() => {
			storage.remove(STORAGE_KEYS.session);
			return true;
		}, { delay: 120 }),

	/** Patches the profile object and optionally flips the onboarding flag. */
	updateProfile: (userId, patch, { completeOnboarding = false } = {}) =>
		request(() => {
			const users = readUsers();
			const index = users.findIndex((user) => user.id === userId);

			if (index === -1) {
				throw new ApiError('Your session has expired. Please log in again.', {
					status: 401,
				});
			}

			const existing = users[index];
			const { name, ...profilePatch } = patch;

			const updated = {
				...existing,
				name: name?.trim() || existing.name,
				onboardingComplete: completeOnboarding || existing.onboardingComplete,
				profile: { ...existing.profile, ...profilePatch },
				updatedAt: new Date().toISOString(),
			};

			users[index] = updated;
			writeUsers(users);

			return publicUser(updated);
		}),

	changePassword: (userId, { currentPassword, newPassword }) =>
		request(() => {
			const users = readUsers();
			const index = users.findIndex((user) => user.id === userId);

			if (index === -1) {
				throw new ApiError('Your session has expired. Please log in again.', {
					status: 401,
				});
			}

			if (users[index].passwordDigest !== digest(currentPassword)) {
				throw new ApiError('Your current password is incorrect.', {
					status: 403,
					fieldErrors: { currentPassword: 'Incorrect password' },
				});
			}

			users[index] = { ...users[index], passwordDigest: digest(newPassword) };
			writeUsers(users);
			return true;
		}),
};
