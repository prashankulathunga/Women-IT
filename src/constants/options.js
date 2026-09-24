/**
 * Controlled vocabularies shared by onboarding, profile editing, job filters
 * and mentor filters. Keeping them in one place is what lets a job posting and
 * a member profile actually match on the same values.
 */

export const EXPERIENCE_LEVELS = [
	{ value: 'associate', label: 'Associate (0-2 yrs)' },
	{ value: 'mid', label: 'Mid-level (3-5 yrs)' },
	{ value: 'senior', label: 'Senior (6-9 yrs)' },
	{ value: 'lead', label: 'Lead / Principal (10+ yrs)' },
	{ value: 'executive', label: 'Head of / Executive' },
];

export const CAREER_TRACKS = [
	{ value: 'engineering', label: 'Software Engineering' },
	{ value: 'qa', label: 'Quality Engineering' },
	{ value: 'data', label: 'Data & AI' },
	{ value: 'product', label: 'Product Management' },
	{ value: 'design', label: 'Product Design / UX' },
	{ value: 'devops', label: 'DevOps & Cloud' },
	{ value: 'security', label: 'Cybersecurity' },
	{ value: 'ba', label: 'Business Analysis' },
	{ value: 'pm', label: 'Delivery & Project Management' },
];

export const WORK_MODES = [
	{ value: 'onsite', label: 'On-site' },
	{ value: 'hybrid', label: 'Hybrid' },
	{ value: 'remote', label: 'Remote' },
];

export const EMPLOYMENT_TYPES = [
	{ value: 'full-time', label: 'Full-time' },
	{ value: 'part-time', label: 'Part-time' },
	{ value: 'contract', label: 'Contract' },
	{ value: 'returnship', label: 'Returnship' },
];

export const LOCATIONS = [
	{ value: 'colombo', label: 'Colombo' },
	{ value: 'kandy', label: 'Kandy' },
	{ value: 'galle', label: 'Galle' },
	{ value: 'jaffna', label: 'Jaffna' },
	{ value: 'negombo', label: 'Negombo' },
	{ value: 'anywhere-lk', label: 'Anywhere in Sri Lanka' },
];

export const SKILL_SUGGESTIONS = [
	'JavaScript',
	'TypeScript',
	'React',
	'Node.js',
	'Java',
	'Spring Boot',
	'Python',
	'Django',
	'.NET',
	'PHP',
	'Flutter',
	'Kotlin',
	'Swift',
	'SQL',
	'MongoDB',
	'AWS',
	'Azure',
	'Kubernetes',
	'Docker',
	'Terraform',
	'CI/CD',
	'Selenium',
	'Cypress',
	'Playwright',
	'Machine Learning',
	'Power BI',
	'Figma',
	'User Research',
	'Scrum',
	'Stakeholder Management',
];

export const MENTORSHIP_GOALS = [
	{ value: 'promotion', label: 'Getting promoted' },
	{ value: 'leadership', label: 'Moving into leadership' },
	{ value: 'switch', label: 'Switching specialisation' },
	{ value: 'return', label: 'Returning after a career break' },
	{ value: 'interview', label: 'Interview preparation' },
	{ value: 'confidence', label: 'Confidence & visibility' },
	{ value: 'salary', label: 'Salary negotiation' },
	{ value: 'balance', label: 'Work-life balance' },
];

export const COMPANY_SIZES = [
	{ value: '1-20', label: '1-20 employees' },
	{ value: '21-100', label: '21-100 employees' },
	{ value: '101-500', label: '101-500 employees' },
	{ value: '500+', label: '500+ employees' },
];

export const AVAILABILITY_OPTIONS = [
	{ value: 'immediate', label: 'Immediately' },
	{ value: '1-month', label: 'Within 1 month' },
	{ value: '3-months', label: 'Within 3 months' },
	{ value: 'exploring', label: 'Just exploring' },
];

export const APPLICATION_STATUS = {
	SUBMITTED: 'submitted',
	IN_REVIEW: 'in-review',
	INTERVIEW: 'interview',
	OFFER: 'offer',
	CLOSED: 'closed',
};

export const APPLICATION_STATUS_META = {
	[APPLICATION_STATUS.SUBMITTED]: { label: 'Submitted', tone: 'neutral' },
	[APPLICATION_STATUS.IN_REVIEW]: { label: 'In review', tone: 'info' },
	[APPLICATION_STATUS.INTERVIEW]: { label: 'Interview', tone: 'brand' },
	[APPLICATION_STATUS.OFFER]: { label: 'Offer', tone: 'success' },
	[APPLICATION_STATUS.CLOSED]: { label: 'Closed', tone: 'danger' },
};

export const REQUEST_STATUS = {
	PENDING: 'pending',
	ACCEPTED: 'accepted',
	DECLINED: 'declined',
	COMPLETED: 'completed',
};

export const REQUEST_STATUS_META = {
	[REQUEST_STATUS.PENDING]: { label: 'Pending', tone: 'warning' },
	[REQUEST_STATUS.ACCEPTED]: { label: 'Accepted', tone: 'success' },
	[REQUEST_STATUS.DECLINED]: { label: 'Declined', tone: 'danger' },
	[REQUEST_STATUS.COMPLETED]: { label: 'Completed', tone: 'brand' },
};

/** Lookup helper for `value -> label` on any option list above. */
export const labelFor = (options, value, fallback = '—') =>
	options.find((option) => option.value === value)?.label ?? fallback;
