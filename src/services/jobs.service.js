import { APPLICATION_STATUS } from '../constants/options';
import { COMPANIES, JOBS } from '../data/jobs';
import { storage, STORAGE_KEYS } from '../lib/storage';
import { ApiError, createId, matchesTerm, paginate, request } from './mockClient';

const readApplications = () => storage.get(STORAGE_KEYS.applications, []);
const writeApplications = (rows) => storage.set(STORAGE_KEYS.applications, rows);

const readPostings = () => storage.get(STORAGE_KEYS.postings, []);
const writePostings = (rows) => storage.set(STORAGE_KEYS.postings, rows);

const readSaved = () => storage.get(STORAGE_KEYS.savedJobs, []);
const writeSaved = (rows) => storage.set(STORAGE_KEYS.savedJobs, rows);

/** Seed postings plus anything a company user created in this browser. */
const allJobs = () => [...readPostings(), ...JOBS];

const sorters = {
	recent: (a, b) => new Date(b.postedAt) - new Date(a.postedAt),
	'salary-high': (a, b) => (b.salary?.max ?? 0) - (a.salary?.max ?? 0),
	closing: (a, b) => new Date(a.closingAt) - new Date(b.closingAt),
	applicants: (a, b) => (a.applicants ?? 0) - (b.applicants ?? 0),
};

export const JOB_SORT_OPTIONS = [
	{ value: 'recent', label: 'Most recent' },
	{ value: 'salary-high', label: 'Highest salary' },
	{ value: 'closing', label: 'Closing soon' },
	{ value: 'applicants', label: 'Fewest applicants' },
];

export const jobsService = {
	list: ({
		search = '',
		track = '',
		level = '',
		workMode = '',
		employmentType = '',
		location = '',
		sort = 'recent',
		page = 1,
		pageSize = 6,
	} = {}) =>
		request(() => {
			const filtered = allJobs()
				.filter((job) =>
					matchesTerm(search, [job.title, job.company, job.summary, ...(job.skills ?? [])]),
				)
				.filter((job) => !track || job.track === track)
				.filter((job) => !level || job.level === level)
				.filter((job) => !workMode || job.workMode === workMode)
				.filter((job) => !employmentType || job.employmentType === employmentType)
				.filter((job) => !location || job.location === location)
				.sort(sorters[sort] ?? sorters.recent);

			return paginate(filtered, { page, pageSize });
		}),

	/** Lightweight list used by the landing page and dashboard widgets. */
	featured: (limit = 3) =>
		request(() => [...JOBS].sort(sorters.recent).slice(0, limit)),

	getById: (jobId) =>
		request(() => {
			const job = allJobs().find((item) => item.id === jobId);
			if (!job) throw new ApiError('That job posting is no longer available.', { status: 404 });
			return { ...job, companyProfile: COMPANIES[job.companyId] ?? null };
		}),

	apply: ({ jobId, userId, userName, coverNote, expectedSalary, availability }) =>
		request(() => {
			const job = allJobs().find((item) => item.id === jobId);
			if (!job) throw new ApiError('That job posting is no longer available.', { status: 404 });

			const applications = readApplications();
			if (applications.some((row) => row.jobId === jobId && row.userId === userId)) {
				throw new ApiError('You have already applied to this role.', { status: 409 });
			}

			const application = {
				id: createId('app'),
				jobId,
				userId,
				userName,
				jobTitle: job.title,
				company: job.company,
				companyId: job.companyId,
				coverNote,
				expectedSalary,
				availability,
				status: APPLICATION_STATUS.SUBMITTED,
				appliedAt: new Date().toISOString(),
			};

			writeApplications([application, ...applications]);
			return application;
		}),

	listApplications: (userId) =>
		request(() =>
			readApplications()
				.filter((row) => row.userId === userId)
				.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)),
		),

	withdrawApplication: (applicationId, userId) =>
		request(() => {
			const remaining = readApplications().filter(
				(row) => !(row.id === applicationId && row.userId === userId),
			);
			writeApplications(remaining);
			return true;
		}),

	hasApplied: (jobId, userId) =>
		request(
			() => readApplications().some((row) => row.jobId === jobId && row.userId === userId),
			{ delay: 120 },
		),

	toggleSaved: (jobId, userId) =>
		request(() => {
			const saved = readSaved();
			const key = `${userId}:${jobId}`;
			const next = saved.includes(key)
				? saved.filter((item) => item !== key)
				: [...saved, key];
			writeSaved(next);
			return next.includes(key);
		}, { delay: 120 }),

	listSaved: (userId) =>
		request(() => {
			const keys = readSaved()
				.filter((key) => key.startsWith(`${userId}:`))
				.map((key) => key.split(':')[1]);
			return allJobs().filter((job) => keys.includes(job.id));
		}),

	/* ---------------------------------------------------------------- company */

	createPosting: ({ userId, company, companyId, ...posting }) =>
		request(() => {
			const record = {
				...posting,
				id: createId('job'),
				ownerId: userId,
				companyId: companyId || `co-${userId}`,
				company,
				postedAt: new Date().toISOString(),
				applicants: 0,
				womenFriendly: posting.womenFriendly ?? [],
				skills: posting.skills ?? [],
				responsibilities: posting.responsibilities ?? [],
				requirements: posting.requirements ?? [],
			};

			writePostings([record, ...readPostings()]);
			return record;
		}),

	listPostings: (userId) =>
		request(() => {
			const own = readPostings().filter((row) => row.ownerId === userId);
			const applications = readApplications();

			return own
				.map((posting) => ({
					...posting,
					applicationCount: applications.filter((row) => row.jobId === posting.id).length,
				}))
				.sort(sorters.recent);
		}),

	closePosting: (jobId, userId) =>
		request(() => {
			const postings = readPostings().map((row) =>
				row.id === jobId && row.ownerId === userId
					? { ...row, closingAt: new Date().toISOString(), closed: true }
					: row,
			);
			writePostings(postings);
			return true;
		}),

	listApplicants: (userId) =>
		request(() => {
			const ownedIds = readPostings()
				.filter((row) => row.ownerId === userId)
				.map((row) => row.id);

			return readApplications()
				.filter((row) => ownedIds.includes(row.jobId))
				.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
		}),

	updateApplicationStatus: (applicationId, status) =>
		request(() => {
			const rows = readApplications().map((row) =>
				row.id === applicationId ? { ...row, status } : row,
			);
			writeApplications(rows);
			return rows.find((row) => row.id === applicationId);
		}),
};
