import { REQUEST_STATUS } from '../constants/options';
import { MENTORS } from '../data/mentors';
import { storage, STORAGE_KEYS } from '../lib/storage';
import { ApiError, createId, matchesTerm, paginate, request } from './mockClient';

const readRequests = () => storage.get(STORAGE_KEYS.mentorRequests, []);
const writeRequests = (rows) => storage.set(STORAGE_KEYS.mentorRequests, rows);

export const mentorsService = {
	list: ({
		search = '',
		track = '',
		focusArea = '',
		availability = '',
		page = 1,
		pageSize = 6,
	} = {}) =>
		request(() => {
			const filtered = MENTORS.filter((mentor) =>
				matchesTerm(search, [
					mentor.name,
					mentor.title,
					mentor.company,
					mentor.bio,
					...(mentor.skills ?? []),
				]),
			)
				.filter((mentor) => !track || mentor.track === track)
				.filter((mentor) => !focusArea || mentor.focusAreas.includes(focusArea))
				.filter((mentor) => !availability || mentor.availability === availability)
				.sort((a, b) => b.rating - a.rating);

			return paginate(filtered, { page, pageSize });
		}),

	featured: (limit = 3) =>
		request(() => [...MENTORS].sort((a, b) => b.rating - a.rating).slice(0, limit)),

	getById: (mentorId) =>
		request(() => {
			const mentor = MENTORS.find((item) => item.id === mentorId);
			if (!mentor) {
				throw new ApiError('That mentor profile is no longer available.', { status: 404 });
			}
			return mentor;
		}),

	/** A member asks a mentor for a session. */
	createRequest: ({ mentorId, userId, userName, goal, message, preferredFormat }) =>
		request(() => {
			const mentor = MENTORS.find((item) => item.id === mentorId);
			if (!mentor) {
				throw new ApiError('That mentor profile is no longer available.', { status: 404 });
			}

			const rows = readRequests();
			const duplicate = rows.some(
				(row) =>
					row.mentorId === mentorId &&
					row.userId === userId &&
					row.status === REQUEST_STATUS.PENDING,
			);

			if (duplicate) {
				throw new ApiError('You already have a pending request with this mentor.', {
					status: 409,
				});
			}

			const record = {
				id: createId('req'),
				mentorId,
				mentorName: mentor.name,
				mentorTitle: mentor.title,
				mentorCompany: mentor.company,
				userId,
				userName,
				goal,
				message,
				preferredFormat,
				status: REQUEST_STATUS.PENDING,
				createdAt: new Date().toISOString(),
			};

			writeRequests([record, ...rows]);
			return record;
		}),

	listForMember: (userId) =>
		request(() =>
			readRequests()
				.filter((row) => row.userId === userId)
				.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
		),

	/**
	 * Incoming requests for a mentor account. Mentor users created through
	 * signup are matched by their linked directory id when one exists,
	 * otherwise every request is surfaced so the role is demonstrable.
	 */
	listForMentor: (mentorDirectoryId) =>
		request(() =>
			readRequests()
				.filter((row) => !mentorDirectoryId || row.mentorId === mentorDirectoryId)
				.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
		),

	respond: (requestId, status, responseNote = '') =>
		request(() => {
			const rows = readRequests().map((row) =>
				row.id === requestId
					? { ...row, status, responseNote, respondedAt: new Date().toISOString() }
					: row,
			);
			writeRequests(rows);
			return rows.find((row) => row.id === requestId);
		}),

	cancel: (requestId, userId) =>
		request(() => {
			writeRequests(
				readRequests().filter((row) => !(row.id === requestId && row.userId === userId)),
			);
			return true;
		}),
};
