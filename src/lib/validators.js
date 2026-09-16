/**
 * Tiny rule-based validation engine backing `useForm`.
 *
 * A schema is `{ fieldName: [rule, rule, …] }`; a rule returns an error
 * message when the value is invalid and `undefined` when it passes.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_PATTERN = /^https?:\/\/[^\s.]+\.\S{2,}$/i;
const LK_PHONE_PATTERN = /^(?:\+94|0)(?:7\d{8}|\d{9})$/;

const isEmpty = (value) =>
	value === null ||
	value === undefined ||
	(typeof value === 'string' && value.trim() === '') ||
	(Array.isArray(value) && value.length === 0);

export const rules = {
	required:
		(message = 'This field is required') =>
		(value) =>
			isEmpty(value) ? message : undefined,

	email:
		(message = 'Enter a valid email address') =>
		(value) =>
			isEmpty(value) || EMAIL_PATTERN.test(String(value).trim())
				? undefined
				: message,

	url:
		(message = 'Enter a valid URL starting with http') =>
		(value) =>
			isEmpty(value) || URL_PATTERN.test(String(value).trim())
				? undefined
				: message,

	phone:
		(message = 'Enter a valid Sri Lankan phone number') =>
		(value) =>
			isEmpty(value) ||
			LK_PHONE_PATTERN.test(String(value).replace(/[\s-]/g, ''))
				? undefined
				: message,

	minLength: (length, message) => (value) =>
		isEmpty(value) || String(value).trim().length >= length
			? undefined
			: message || `Must be at least ${length} characters`,

	maxLength: (length, message) => (value) =>
		isEmpty(value) || String(value).trim().length <= length
			? undefined
			: message || `Must be ${length} characters or fewer`,

	minItems: (count, message) => (value) =>
		Array.isArray(value) && value.length < count
			? message || `Select at least ${count}`
			: undefined,

	strongPassword:
		(message = 'Use 8+ characters with at least one letter and one number') =>
		(value) => {
			if (isEmpty(value)) return undefined;
			const text = String(value);
			return text.length >= 8 && /[A-Za-z]/.test(text) && /\d/.test(text)
				? undefined
				: message;
		},

	matches:
		(otherField, message = 'Values do not match') =>
		(value, values) =>
			isEmpty(value) || value === values[otherField] ? undefined : message,

	accepted:
		(message = 'You must accept this to continue') =>
		(value) =>
			value === true ? undefined : message,
};

/**
 * Runs a schema against a values object.
 * @returns {Record<string, string>} field -> first failing message
 */
export const validateSchema = (values, schema = {}) => {
	const errors = {};

	for (const [field, fieldRules] of Object.entries(schema)) {
		for (const rule of fieldRules) {
			const message = rule(values[field], values);
			if (message) {
				errors[field] = message;
				break;
			}
		}
	}

	return errors;
};

/** 0-100 score powering the signup password meter. */
export const passwordStrength = (password = '') => {
	if (!password) return { score: 0, label: 'Empty' };

	let score = 0;
	if (password.length >= 8) score += 30;
	if (password.length >= 12) score += 15;
	if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 20;
	if (/\d/.test(password)) score += 20;
	if (/[^A-Za-z0-9]/.test(password)) score += 15;

	const clamped = Math.min(100, score);
	const label =
		clamped >= 80
			? 'Strong'
			: clamped >= 55
				? 'Good'
				: clamped >= 30
					? 'Fair'
					: 'Weak';

	return { score: clamped, label };
};
