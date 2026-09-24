import { ROLES } from './roles';
import { ROUTES } from './routes';

/**
 * Dashboard sidebar model.
 * `roles` declares who sees an item; the sidebar and the mobile nav both
 * render from this list so they can never drift apart.
 */
export const DASHBOARD_NAV = [
	{
		title: 'Overview',
		items: [
			{
				label: 'Dashboard',
				to: ROUTES.dashboard,
				icon: 'grid',
				end: true,
				roles: [ROLES.MEMBER, ROLES.MENTOR, ROLES.COMPANY],
			},
		],
	},
	{
		title: 'Opportunities',
		items: [
			{
				label: 'Job board',
				to: ROUTES.jobs,
				icon: 'briefcase',
				roles: [ROLES.MEMBER, ROLES.MENTOR],
			},
			{
				label: 'My applications',
				to: ROUTES.applications,
				icon: 'clipboard',
				roles: [ROLES.MEMBER],
			},
			{
				label: 'Job postings',
				to: ROUTES.companyPostings,
				icon: 'briefcase',
				roles: [ROLES.COMPANY],
			},
			{
				label: 'Applicants',
				to: ROUTES.companyApplicants,
				icon: 'users',
				roles: [ROLES.COMPANY],
			},
		],
	},
	{
		title: 'Mentorship',
		items: [
			{
				label: 'Find a mentor',
				to: ROUTES.mentors,
				icon: 'compass',
				roles: [ROLES.MEMBER],
			},
			{
				label: 'My requests',
				to: ROUTES.mentorRequests,
				icon: 'messages',
				roles: [ROLES.MEMBER],
			},
			{
				label: 'Mentee requests',
				to: ROUTES.mentorRequests,
				icon: 'messages',
				roles: [ROLES.MENTOR],
			},
		],
	},
	{
		title: 'Gain up skills',
		items: [
			{
				label: 'Blogs & stories',
				to: ROUTES.blogs,
				icon: 'book',
				roles: [ROLES.MEMBER, ROLES.MENTOR, ROLES.COMPANY],
			},
			{
				label: 'Workshops',
				to: ROUTES.workshops,
				icon: 'sparkle',
				roles: [ROLES.MEMBER, ROLES.MENTOR, ROLES.COMPANY],
			},
		],
	},
	{
		title: 'Account',
		items: [
			{
				label: 'Profile',
				to: ROUTES.profile,
				icon: 'user',
				roles: [ROLES.MEMBER, ROLES.MENTOR, ROLES.COMPANY],
			},
			{
				label: 'Settings',
				to: ROUTES.settings,
				icon: 'settings',
				roles: [ROLES.MEMBER, ROLES.MENTOR, ROLES.COMPANY],
			},
		],
	},
];

/** Returns only the sections/items visible to `role`, dropping empty sections. */
export const navigationForRole = (role) =>
	DASHBOARD_NAV.map((section) => ({
		...section,
		items: section.items.filter((item) => item.roles.includes(role)),
	})).filter((section) => section.items.length > 0);

/** Marketing header links (in-page anchors on the landing page). */
export const MARKETING_NAV = [
	{ label: 'Why Aruna', to: '/#pillars' },
	{ label: 'Job board', to: '/#jobs' },
	{ label: 'Mentorship', to: '/#mentors' },
	{ label: 'Workshops', to: '/#workshops' },
	{ label: 'Stories', to: '/#stories' },
];

export const FOOTER_NAV = [
	{
		title: 'Platform',
		links: [
			{ label: 'Job board', to: ROUTES.jobs },
			{ label: 'Mentorship', to: ROUTES.mentors },
			{ label: 'Workshops', to: ROUTES.workshops },
			{ label: 'Blogs & stories', to: ROUTES.blogs },
		],
	},
	{
		title: 'Community',
		links: [
			{ label: 'Become a mentor', to: ROUTES.signup },
			{ label: 'Partner with us', to: ROUTES.signup },
			{ label: 'Our story', to: ROUTES.about },
		],
	},
	{
		title: 'Support',
		links: [
			{ label: 'Help centre', to: ROUTES.about },
			{ label: 'Privacy policy', to: ROUTES.about },
			{ label: 'Terms of service', to: ROUTES.about },
		],
	},
];
