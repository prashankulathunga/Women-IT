/**
 * The three account types the platform is built around.
 * Everything role-aware (routing, navigation, dashboards, onboarding steps)
 * keys off these constants — never off raw strings.
 */
export const ROLES = {
	MEMBER: 'member',
	MENTOR: 'mentor',
	COMPANY: 'company',
};

export const ROLE_LIST = [ROLES.MEMBER, ROLES.MENTOR, ROLES.COMPANY];

export const ROLE_META = {
	[ROLES.MEMBER]: {
		id: ROLES.MEMBER,
		label: 'Woman in tech',
		shortLabel: 'Member',
		tagline: 'Grow your career, find mentors and apply to vetted roles.',
		signupBlurb:
			'For women already working in Sri Lankan IT who want the next step.',
		accent: 'brand',
	},
	[ROLES.MENTOR]: {
		id: ROLES.MENTOR,
		label: 'Mentor',
		shortLabel: 'Mentor',
		tagline: 'Share what you know with women a few steps behind you.',
		signupBlurb:
			'For senior technologists and leaders offering guidance and sessions.',
		accent: 'plum',
	},
	[ROLES.COMPANY]: {
		id: ROLES.COMPANY,
		label: 'Company',
		shortLabel: 'Company',
		tagline: 'Hire from a community of experienced women technologists.',
		signupBlurb:
			'For employer partners posting roles and running workshops.',
		accent: 'ink',
	},
};

export const roleLabel = (role) => ROLE_META[role]?.label ?? 'Member';

/** Landing route after login / onboarding for each role. */
export const isRole = (user, ...roles) => Boolean(user) && roles.includes(user.role);
