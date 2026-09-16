/**
 * Single source of truth for every URL in the app.
 * Components link through these helpers so a path change is a one-line edit.
 */
export const ROUTES = {
	home: '/',
	about: '/about',
	login: '/login',
	signup: '/signup',
	onboarding: '/onboarding',

	dashboard: '/app',
	profile: '/app/profile',
	settings: '/app/settings',

	jobs: '/app/jobs',
	jobDetail: (id = ':jobId') => `/app/jobs/${id}`,
	applications: '/app/applications',

	mentors: '/app/mentors',
	mentorDetail: (id = ':mentorId') => `/app/mentors/${id}`,
	mentorRequests: '/app/mentorship',

	blogs: '/app/blogs',
	blogDetail: (slug = ':slug') => `/app/blogs/${slug}`,
	workshops: '/app/workshops',

	companyPostings: '/app/postings',
	companyApplicants: '/app/applicants',

	notFound: '*',
};
