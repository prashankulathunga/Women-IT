import { APPROVAL_STATUS } from '../constants/options';
import { ROLES } from '../constants/roles';
import { storage, STORAGE_KEYS } from '../lib/storage';

/**
 * The single source of truth for the user table.
 *
 * Every module that reads or writes an account goes through here — the auth
 * service, the approval service and the live-sync hook. Nothing else is
 * allowed to `JSON.parse` the users array, which is what keeps the approval
 * status consistent across tabs.
 *
 * Backed by `localStorage["aruna:users"]`.
 */

/**
 * Non-cryptographic digest so a demo database never holds readable passwords.
 * This is NOT password hashing — real credential checks belong on a server.
 */
export const digest = (value) => {
	let hash = 0;
	for (let index = 0; index < value.length; index += 1) {
		hash = (hash << 5) - hash + value.charCodeAt(index);
		hash |= 0;
	}
	return `d${Math.abs(hash).toString(36)}`;
};

/** Strips the credential digest before a record leaves the store. */
export const toPublicUser = (user) => {
	if (!user) return null;
	const safe = { ...user };
	delete safe.passwordDigest;
	return safe;
};

/**
 * Staff cannot self-register, so one administrator is seeded on first read.
 * Credentials are documented in the README; change them before any real use.
 */
const SEED_ADMIN = {
	id: 'usr-admin-seed',
	name: 'Aruna Admin',
	email: 'admin@aruna.lk',
	role: ROLES.ADMIN,
	passwordDigest: digest('Admin2026!'),
	approvalStatus: APPROVAL_STATUS.NOT_REQUIRED,
	onboardingComplete: true,
	createdAt: '2026-01-01T00:00:00.000Z',
	profile: {
		headline: 'Community & trust',
		bio: '',
		location: 'colombo',
		phone: '',
		linkedin: '',
		avatarUrl: '',
	},
};

export const readUsers = () => {
	const users = storage.get(STORAGE_KEYS.users, []);
	if (users.some((user) => user.role === ROLES.ADMIN)) return users;

	// Seed once, then persist so the id stays stable across reloads.
	const seeded = [...users, SEED_ADMIN];
	storage.set(STORAGE_KEYS.users, seeded);
	return seeded;
};

export const writeUsers = (users) => storage.set(STORAGE_KEYS.users, users);

export const findUserById = (userId) =>
	readUsers().find((user) => user.id === userId) ?? null;

export const findUserByEmail = (email) => {
	const normalised = String(email).trim().toLowerCase();
	return readUsers().find((user) => user.email === normalised) ?? null;
};

export const insertUser = (user) => {
	writeUsers([...readUsers(), user]);
	return user;
};

/**
 * Merges `patch` into one user and persists the whole table.
 * @returns {object|null} the updated record, or null when the id is unknown.
 */
export const updateUserById = (userId, patch) => {
	const users = readUsers();
	const index = users.findIndex((user) => user.id === userId);
	if (index === -1) return null;

	const updated = { ...users[index], ...patch, updatedAt: new Date().toISOString() };
	users[index] = updated;
	writeUsers(users);
	return updated;
};

export const listUsersByApproval = (...statuses) =>
	readUsers().filter((user) => statuses.includes(user.approvalStatus));

/** Reads one user's approval status without pulling the whole record. */
export const readApprovalStatus = (userId) => findUserById(userId)?.approvalStatus ?? null;

/** The localStorage key other tabs will report in a `storage` event. */
export const USERS_STORAGE_KEY = `aruna:${STORAGE_KEYS.users}`;
