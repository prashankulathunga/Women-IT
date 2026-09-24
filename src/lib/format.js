// en-GB rather than en-LK: Sri Lanka uses day-first dates and 1,000 grouping,
// and en-GB is guaranteed present in every browser's ICU data, whereas en-LK
// silently falls back to US month-first formatting in several engines.
const LOCALE = 'en-GB';

/** "Nimasha Perera" -> "NP" */
export const initialsOf = (name = '') =>
	name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part.charAt(0).toUpperCase())
		.join('') || '?';

/** 1250000 -> "LKR 1,250,000" */
export const formatCurrency = (amount, currency = 'LKR') => {
	if (amount === null || amount === undefined) return 'Not disclosed';
	return `${currency} ${new Intl.NumberFormat(LOCALE).format(amount)}`;
};

/** Salary band helper: "LKR 350,000 - 480,000 / month" */
export const formatSalaryRange = ({
	min,
	max,
	currency = 'LKR',
	period = 'month',
} = {}) => {
	if (!min && !max) return 'Salary on application';
	const fmt = new Intl.NumberFormat(LOCALE);
	if (min && max) {
		return `${currency} ${fmt.format(min)}–${fmt.format(max)} / ${period}`;
	}
	return `${currency} ${fmt.format(min || max)}+ / ${period}`;
};

/** ISO date -> "12 Mar 2026" */
export const formatDate = (value, options) => {
	if (!value) return '—';
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return '—';
	return new Intl.DateTimeFormat(LOCALE, {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		...options,
	}).format(date);
};

/** ISO date -> "12 Mar 2026, 6:30 pm" */
export const formatDateTime = (value) =>
	formatDate(value, { hour: 'numeric', minute: '2-digit' });

/** ISO date -> "3 days ago" / "in 2 weeks" */
export const formatRelativeTime = (value) => {
	if (!value) return '—';
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return '—';

	const diffMs = date.getTime() - Date.now();
	const rtf = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });
	const units = [
		['year', 1000 * 60 * 60 * 24 * 365],
		['month', 1000 * 60 * 60 * 24 * 30],
		['week', 1000 * 60 * 60 * 24 * 7],
		['day', 1000 * 60 * 60 * 24],
		['hour', 1000 * 60 * 60],
		['minute', 1000 * 60],
	];

	for (const [unit, ms] of units) {
		if (Math.abs(diffMs) >= ms) return rtf.format(Math.round(diffMs / ms), unit);
	}
	return 'just now';
};

/** Clamp long copy for card previews without cutting mid-word. */
export const truncate = (text = '', maxLength = 140) => {
	if (text.length <= maxLength) return text;
	const cut = text.lastIndexOf(' ', maxLength);
	return `${text.slice(0, cut > 0 ? cut : maxLength).trimEnd()}…`;
};

export const pluralise = (count, singular, plural = `${singular}s`) =>
	`${count} ${count === 1 ? singular : plural}`;

/** Rough reading time used on blog cards. */
export const readingTime = (text = '') =>
	`${Math.max(1, Math.round(text.trim().split(/\s+/).length / 200))} min read`;

/** Percentage helper that never divides by zero. */
export const toPercent = (value, total) =>
	total > 0 ? Math.round((value / total) * 100) : 0;

/** True when a posting closes within `days` — used for the urgency badge. */
export const isClosingSoon = (value, days = 7) => {
	if (!value) return false;
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return false;
	const remaining = date.getTime() - Date.now();
	return remaining > 0 && remaining < days * 24 * 60 * 60 * 1000;
};

/** True when a posting's closing date has passed. */
export const hasClosed = (value) => {
	if (!value) return false;
	const date = value instanceof Date ? value : new Date(value);
	return !Number.isNaN(date.getTime()) && date.getTime() < Date.now();
};
