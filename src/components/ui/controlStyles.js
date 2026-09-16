import { cn } from '../../lib/cn';

/**
 * Shared surface for every form control (input, select, textarea, tag input).
 * Kept in a component-free module so Fast Refresh stays clean.
 */
export const controlClasses = (hasError, extra) =>
	cn(
		'w-full rounded-field border bg-white text-sm text-ink-900 transition-colors duration-150',
		'placeholder:text-ink-400 outline-none',
		'disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400',
		hasError
			? 'border-danger-500 focus:border-danger-500 focus:ring-4 focus:ring-danger-500/12'
			: 'border-line-strong hover:border-ink-300 focus:border-brand-600 focus:ring-4 focus:ring-brand-600/12',
		extra,
	);

/** Points a control at its error or hint text for screen readers. */
export const describedBy = (id, error, hint) => {
	if (error) return `${id}-error`;
	if (hint) return `${id}-hint`;
	return undefined;
};
