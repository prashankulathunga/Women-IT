/**
 * The account types the platform is built around.
 * Everything role-aware (routing, navigation, dashboards, onboarding steps)
 * keys off these constants — never off raw strings.
 *
 * MEMBER is the "woman in tech" account. It is the only role subject to
 * identity verification and admin approval; see `constants/options.js`.
 * ADMIN is staff-only and is never offered in the public signup picker.
 */
export const ROLES = {
	MEMBER: 'member',
	MENTOR: 'mentor',
	COMPANY: 'company',
	ADMIN: 'admin',
};

/** Every role, including staff. Use for lookups, not for rendering choices. */
export const ROLE_LIST = [ROLES.MEMBER, ROLES.MENTOR, ROLES.COMPANY, ROLES.ADMIN];

/** The roles a visitor may actually create for themselves. */
export const SIGNUP_ROLES = [ROLES.MEMBER, ROLES.MENTOR, ROLES.COMPANY];

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
		signupBlurb: 'For employer partners posting roles and running workshops.',
		accent: 'ink',
	},
	[ROLES.ADMIN]: {
		id: ROLES.ADMIN,
		label: 'Administrator',
		shortLabel: 'Admin',
		tagline: 'Review new members and keep the community safe.',
		signupBlurb: 'Staff accounts are created internally.',
		accent: 'ink',
	},
};

export const roleLabel = (role) => ROLE_META[role]?.label ?? 'Member';

export const isRole = (user, ...roles) => Boolean(user) && roles.includes(user.role);

/**
 * Only the woman-in-tech account is identity-verified. Every other role keeps
 * the behaviour it had before approval existed.
 */
export const requiresApproval = (role) => role === ROLES.MEMBER;
