import { BLOGS, WORKSHOPS } from '../data/learning';
import { storage, STORAGE_KEYS } from '../lib/storage';
import { ApiError, createId, matchesTerm, paginate, request } from './mockClient';

const readEnrolments = () => storage.get(STORAGE_KEYS.enrolments, []);
const writeEnrolments = (rows) => storage.set(STORAGE_KEYS.enrolments, rows);

/** Local registrations count towards the seat total shown in the UI. */
const withSeatCount = (workshop, enrolments) => {
	const localSeats = enrolments.filter((row) => row.workshopId === workshop.id).length;
	const seatsTaken = Math.min(workshop.seats, workshop.seatsTaken + localSeats);

	return {
		...workshop,
		seatsTaken,
		seatsLeft: Math.max(0, workshop.seats - seatsTaken),
		isFull: seatsTaken >= workshop.seats,
	};
};

export const learningService = {
	listBlogs: ({ search = '', category = '', page = 1, pageSize = 6 } = {}) =>
		request(() => {
			const filtered = BLOGS.filter((post) =>
				matchesTerm(search, [post.title, post.excerpt, post.author, ...(post.tags ?? [])]),
			)
				.filter((post) => !category || post.category === category)
				.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

			return paginate(filtered, { page, pageSize });
		}),

	featuredBlogs: (limit = 3) =>
		request(() =>
			[...BLOGS]
				.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
				.slice(0, limit),
		),

	getBlog: (slug) =>
		request(() => {
			const post = BLOGS.find((item) => item.slug === slug);
			if (!post) throw new ApiError('That article could not be found.', { status: 404 });

			const related = BLOGS.filter(
				(item) => item.slug !== slug && item.category === post.category,
			).slice(0, 2);

			return { ...post, related };
		}),

	listWorkshops: ({ search = '', track = '', format = '', page = 1, pageSize = 6 } = {}) =>
		request(() => {
			const enrolments = readEnrolments();
			const filtered = WORKSHOPS.map((workshop) => withSeatCount(workshop, enrolments))
				.filter((workshop) =>
					matchesTerm(search, [
						workshop.title,
						workshop.summary,
						workshop.facilitator,
						...(workshop.tags ?? []),
					]),
				)
				.filter((workshop) => !track || workshop.track === track)
				.filter((workshop) => !format || workshop.format === format)
				.sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));

			return paginate(filtered, { page, pageSize });
		}),

	featuredWorkshops: (limit = 3) =>
		request(() => {
			const enrolments = readEnrolments();
			return [...WORKSHOPS]
				.map((workshop) => withSeatCount(workshop, enrolments))
				.sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt))
				.slice(0, limit);
		}),

	register: ({ workshopId, userId, userName, email, motivation }) =>
		request(() => {
			const workshop = WORKSHOPS.find((item) => item.id === workshopId);
			if (!workshop) {
				throw new ApiError('That workshop is no longer listed.', { status: 404 });
			}

			const enrolments = readEnrolments();

			if (enrolments.some((row) => row.workshopId === workshopId && row.userId === userId)) {
				throw new ApiError('You are already registered for this workshop.', { status: 409 });
			}

			if (withSeatCount(workshop, enrolments).isFull) {
				throw new ApiError('This workshop is fully booked. Join the waitlist instead.', {
					status: 409,
				});
			}

			const record = {
				id: createId('enr'),
				workshopId,
				workshopTitle: workshop.title,
				startsAt: workshop.startsAt,
				facilitator: workshop.facilitator,
				format: workshop.format,
				userId,
				userName,
				email,
				motivation,
				registeredAt: new Date().toISOString(),
			};

			writeEnrolments([record, ...enrolments]);
			return record;
		}),

	listEnrolments: (userId) =>
		request(() =>
			readEnrolments()
				.filter((row) => row.userId === userId)
				.sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt)),
		),

	cancelEnrolment: (enrolmentId, userId) =>
		request(() => {
			writeEnrolments(
				readEnrolments().filter((row) => !(row.id === enrolmentId && row.userId === userId)),
			);
			return true;
		}),

	isRegistered: (workshopId, userId) =>
		request(
			() =>
				readEnrolments().some(
					(row) => row.workshopId === workshopId && row.userId === userId,
				),
			{ delay: 120 },
		),
};
