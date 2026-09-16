/**
 * Mock transport layer.
 *
 * Every service in this folder goes through `request()`, which simulates
 * network latency and error shape. When a real backend lands, only this file
 * and the service bodies change — no component or hook touches transport.
 */

const MIN_LATENCY = 180;
const MAX_LATENCY = 460;

/** Error type the UI can branch on (status codes, field errors). */
export class ApiError extends Error {
	constructor(message, { status = 400, fieldErrors = null } = {}) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.fieldErrors = fieldErrors;
	}
}

const randomLatency = () =>
	Math.round(MIN_LATENCY + Math.random() * (MAX_LATENCY - MIN_LATENCY));

/**
 * Runs `resolver` after a simulated round-trip.
 * @template T
 * @param {() => T | Promise<T>} resolver
 * @param {{ delay?: number }} [options]
 * @returns {Promise<T>}
 */
export const request = (resolver, { delay } = {}) =>
	new Promise((resolve, reject) => {
		setTimeout(async () => {
			try {
				resolve(await resolver());
			} catch (error) {
				reject(
					error instanceof ApiError
						? error
						: new ApiError(error?.message || 'Unexpected error', { status: 500 }),
				);
			}
		}, delay ?? randomLatency());
	});

/** Stable id generator for records created in the browser. */
export const createId = (prefix) =>
	`${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

/**
 * Case-insensitive "does this record match the search term" helper.
 * @param {string} term
 * @param {string[]} haystack
 */
export const matchesTerm = (term, haystack = []) => {
	if (!term) return true;
	const needle = term.trim().toLowerCase();
	if (!needle) return true;
	return haystack.some((value) => String(value ?? '').toLowerCase().includes(needle));
};

/** Slices a list into a page envelope shared by every list endpoint. */
export const paginate = (items, { page = 1, pageSize = 8 } = {}) => {
	const total = items.length;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const safePage = Math.min(Math.max(1, page), totalPages);
	const start = (safePage - 1) * pageSize;

	return {
		items: items.slice(start, start + pageSize),
		page: safePage,
		pageSize,
		total,
		totalPages,
	};
};
