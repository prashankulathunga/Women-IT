import {
	AVAILABILITY_OPTIONS,
	CAREER_TRACKS,
	COMPANY_SIZES,
	EXPERIENCE_LEVELS,
	LOCATIONS,
	MENTORSHIP_GOALS,
	SKILL_SUGGESTIONS,
} from '../../constants/options';
import { ROLES } from '../../constants/roles';
import { rules } from '../../lib/validators';

/**
 * The single definition of what a profile contains, per role.
 *
 * Both the onboarding wizard and the profile editor render from this, so the
 * data collected at signup and the data editable later are the same shape
 * with the same validation. Adding a field is a one-place change.
 */

const IDENTITY_FIELDS = [
	{
		name: 'title',
		label: 'Current job title',
		placeholder: 'Senior Software Engineer',
		validation: [rules.required('Your current title helps us match roles')],
		colSpan: 1,
	},
	{
		name: 'company',
		label: 'Current employer',
		placeholder: 'Sysco LABS',
		validation: [rules.required('Where are you working now?')],
		colSpan: 1,
	},
	{
		name: 'track',
		type: 'select',
		label: 'Specialisation',
		placeholder: 'Choose your track',
		options: CAREER_TRACKS,
		validation: [rules.required('Pick the track closest to your work')],
		colSpan: 1,
	},
	{
		name: 'level',
		type: 'select',
		label: 'Experience level',
		placeholder: 'Choose your level',
		options: EXPERIENCE_LEVELS,
		validation: [rules.required('Select your level')],
		colSpan: 1,
	},
	{
		name: 'yearsExperience',
		type: 'number',
		label: 'Years in the industry',
		placeholder: '7',
		min: 0,
		max: 50,
		validation: [rules.required('How many years have you been working?')],
		colSpan: 1,
	},
	{
		name: 'location',
		type: 'select',
		label: 'Based in',
		placeholder: 'Choose a location',
		options: LOCATIONS,
		validation: [rules.required('Where are you based?')],
		colSpan: 1,
	},
];

const CONTACT_FIELDS = [
	{
		name: 'phone',
		label: 'Phone number',
		placeholder: '0771234567',
		optional: true,
		hint: 'Only shared once you accept an interview.',
		validation: [rules.phone()],
		colSpan: 1,
	},
	{
		name: 'linkedin',
		label: 'LinkedIn profile',
		placeholder: 'https://linkedin.com/in/yourname',
		optional: true,
		validation: [rules.url()],
		colSpan: 1,
	},
];

const MEMBER_STEPS = [
	{
		id: 'about',
		title: 'About your work',
		description: 'This is what we match roles and mentors against.',
		fields: IDENTITY_FIELDS,
	},
	{
		id: 'skills',
		title: 'Skills and goals',
		description: 'Be honest rather than aspirational — matching works better that way.',
		fields: [
			{
				name: 'skills',
				type: 'tags',
				label: 'Your core skills',
				placeholder: 'Add a skill and press Enter',
				suggestions: SKILL_SUGGESTIONS,
				max: 12,
				validation: [rules.minItems(3, 'Add at least three skills')],
				colSpan: 2,
			},
			{
				name: 'goals',
				type: 'chips',
				label: 'What are you working towards?',
				options: MENTORSHIP_GOALS,
				max: 3,
				validation: [rules.minItems(1, 'Choose at least one goal')],
				colSpan: 2,
			},
			{
				name: 'availability',
				type: 'select',
				label: 'Open to new roles',
				placeholder: 'Select availability',
				options: AVAILABILITY_OPTIONS,
				validation: [rules.required('Let employers know your availability')],
				colSpan: 1,
			},
		],
	},
	{
		id: 'story',
		title: 'Your story',
		description: 'The part a CV cannot carry. Employers and mentors read this first.',
		fields: [
			{
				name: 'headline',
				label: 'Headline',
				placeholder: 'Backend engineer moving into platform leadership',
				validation: [
					rules.required('Write a one-line headline'),
					rules.maxLength(90),
				],
				colSpan: 2,
			},
			{
				name: 'bio',
				type: 'textarea',
				label: 'About you',
				rows: 6,
				maxLength: 800,
				showCount: true,
				placeholder:
					'What you have built, what you are good at, and what you want next.',
				validation: [
					rules.required('Tell us a little about yourself'),
					rules.minLength(80, 'A short paragraph — at least 80 characters'),
				],
				colSpan: 2,
			},
			...CONTACT_FIELDS,
			{
				name: 'openToRelocation',
				type: 'checkbox',
				label: 'I am open to relocating within Sri Lanka',
				colSpan: 2,
			},
		],
	},
];

const MENTOR_STEPS = [
	{
		id: 'about',
		title: 'About your work',
		description: 'Mentees choose you on the strength of this.',
		fields: IDENTITY_FIELDS,
	},
	{
		id: 'expertise',
		title: 'What you can help with',
		description: 'Narrow beats broad — specific offers get taken up far more often.',
		fields: [
			{
				name: 'skills',
				type: 'tags',
				label: 'Areas of expertise',
				placeholder: 'Add an area and press Enter',
				suggestions: SKILL_SUGGESTIONS,
				max: 12,
				validation: [rules.minItems(3, 'Add at least three areas')],
				colSpan: 2,
			},
			{
				name: 'focusAreas',
				type: 'chips',
				label: 'Mentorship focus',
				options: MENTORSHIP_GOALS,
				max: 4,
				validation: [rules.minItems(1, 'Choose at least one focus area')],
				colSpan: 2,
			},
			{
				name: 'capacity',
				type: 'select',
				label: 'Mentees you can take on',
				placeholder: 'Select capacity',
				options: [
					{ value: '1', label: '1 mentee' },
					{ value: '2', label: '2 mentees' },
					{ value: '3', label: '3 mentees' },
					{ value: '4', label: '4 mentees' },
					{ value: '5', label: '5 or more' },
				],
				validation: [rules.required('Set your capacity')],
				colSpan: 1,
			},
		],
	},
	{
		id: 'story',
		title: 'Your story',
		description: 'Why you, and what a session with you is actually like.',
		fields: [
			{
				name: 'headline',
				label: 'Headline',
				placeholder: 'Engineering director — I coach first-time managers',
				validation: [rules.required('Write a one-line headline'), rules.maxLength(90)],
				colSpan: 2,
			},
			{
				name: 'bio',
				type: 'textarea',
				label: 'About you',
				rows: 6,
				maxLength: 800,
				showCount: true,
				placeholder:
					'The path you took, what you are direct about, and who you are best placed to help.',
				validation: [
					rules.required('Tell mentees about yourself'),
					rules.minLength(80, 'A short paragraph — at least 80 characters'),
				],
				colSpan: 2,
			},
			...CONTACT_FIELDS,
		],
	},
];

const COMPANY_STEPS = [
	{
		id: 'company',
		title: 'About the company',
		description: 'Candidates see this on every role you post.',
		fields: [
			{
				name: 'companyName',
				label: 'Company name',
				placeholder: '99x',
				validation: [rules.required('Enter your company name')],
				colSpan: 1,
			},
			{
				name: 'industry',
				label: 'Industry',
				placeholder: 'Product engineering',
				validation: [rules.required('What industry are you in?')],
				colSpan: 1,
			},
			{
				name: 'companySize',
				type: 'select',
				label: 'Company size',
				placeholder: 'Select a size',
				options: COMPANY_SIZES,
				validation: [rules.required('Select your company size')],
				colSpan: 1,
			},
			{
				name: 'location',
				type: 'select',
				label: 'Head office',
				placeholder: 'Choose a location',
				options: LOCATIONS,
				validation: [rules.required('Where are you based?')],
				colSpan: 1,
			},
			{
				name: 'website',
				label: 'Website',
				placeholder: 'https://example.lk',
				validation: [rules.required('Add your website'), rules.url()],
				colSpan: 2,
			},
		],
	},
	{
		id: 'hiring',
		title: 'What you hire for',
		description: 'We surface your roles to members working in these tracks.',
		fields: [
			{
				name: 'hiringFocus',
				type: 'chips',
				label: 'Tracks you hire for',
				options: CAREER_TRACKS,
				max: 5,
				validation: [rules.minItems(1, 'Choose at least one track')],
				colSpan: 2,
			},
			{
				name: 'title',
				label: 'Your role at the company',
				placeholder: 'Talent Acquisition Lead',
				validation: [rules.required('What is your role?')],
				colSpan: 1,
			},
			{
				name: 'phone',
				label: 'Contact number',
				placeholder: '0112345678',
				optional: true,
				validation: [rules.phone()],
				colSpan: 1,
			},
		],
	},
	{
		id: 'story',
		title: 'Your pitch',
		description: 'Why a senior woman should choose you over the company down the road.',
		fields: [
			{
				name: 'headline',
				label: 'Headline',
				placeholder: 'Nordic product engineering, 41% women in tech roles',
				validation: [rules.required('Write a one-line headline'), rules.maxLength(90)],
				colSpan: 2,
			},
			{
				name: 'bio',
				type: 'textarea',
				label: 'About the company',
				rows: 6,
				maxLength: 800,
				showCount: true,
				placeholder:
					'The work, the culture, and the specific policies that back it up.',
				validation: [
					rules.required('Tell candidates about the company'),
					rules.minLength(80, 'A short paragraph — at least 80 characters'),
				],
				colSpan: 2,
			},
		],
	},
];

const STEPS_BY_ROLE = {
	[ROLES.MEMBER]: MEMBER_STEPS,
	[ROLES.MENTOR]: MENTOR_STEPS,
	[ROLES.COMPANY]: COMPANY_STEPS,
};

export const stepsForRole = (role) => STEPS_BY_ROLE[role] ?? MEMBER_STEPS;

/** All fields for a role, flattened — used by the profile editor. */
export const fieldsForRole = (role) =>
	stepsForRole(role).flatMap((step) => step.fields);

/** Builds a `useForm` schema from a list of field descriptors. */
export const schemaFromFields = (fields) =>
	fields.reduce((schema, field) => {
		if (field.validation?.length) schema[field.name] = field.validation;
		return schema;
	}, {});

/** Seeds form values from the stored profile, filling gaps by control type. */
export const initialValuesFromProfile = (role, profile = {}) =>
	fieldsForRole(role).reduce((values, field) => {
		const stored = profile[field.name];
		if (field.type === 'tags' || field.type === 'chips') {
			values[field.name] = Array.isArray(stored) ? stored : [];
		} else if (field.type === 'checkbox') {
			values[field.name] = Boolean(stored);
		} else {
			values[field.name] = stored ?? '';
		}
		return values;
	}, {});
