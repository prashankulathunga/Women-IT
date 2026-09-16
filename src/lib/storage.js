/**
 * Namespaced, crash-safe wrapper around localStorage.
 *
 * Storage access can throw (private mode, blocked site data, embedded
 * previews) so every call is guarded and degrades to an in-memory map.
 */
const PREFIX = 'aruna:';
const memoryFallback = new Map();

const isAvailable = (() => {
	try {
		const probe = `${PREFIX}__probe__`;
		window.localStorage.setItem(probe, '1');
		window.localStorage.removeItem(probe);
		return true;
	} catch {
		return false;
	}
})();

export const storage = {
	get(key, fallback = null) {
		const namespaced = PREFIX + key;
		try {
			const raw = isAvailable
				? window.localStorage.getItem(namespaced)
				: memoryFallback.get(namespaced);
			return raw ? JSON.parse(raw) : fallback;
		} catch {
			return fallback;
		}
	},

	set(key, value) {
		const namespaced = PREFIX + key;
		try {
			const raw = JSON.stringify(value);
			if (isAvailable) window.localStorage.setItem(namespaced, raw);
			else memoryFallback.set(namespaced, raw);
		} catch {
			/* quota exceeded or unserialisable value — non-fatal */
		}
	},

	remove(key) {
		const namespaced = PREFIX + key;
		try {
			if (isAvailable) window.localStorage.removeItem(namespaced);
			else memoryFallback.delete(namespaced);
		} catch {
			/* no-op */
		}
	},
};

export const STORAGE_KEYS = {
	session: 'session',
	users: 'users',
	applications: 'applications',
	mentorRequests: 'mentor-requests',
	enrolments: 'enrolments',
	savedJobs: 'saved-jobs',
	postings: 'postings',
};
