import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';
import { Button } from './Button';

/**
 * Empty and error states.
 *
 * Every list in the product routes its zero-result and failure cases through
 * this component, so users always get an explanation plus a way forward
 * rather than a blank panel.
 */
const TONES = {
	neutral: 'bg-ink-100 text-ink-500',
	brand: 'bg-brand-50 text-brand-700',
	danger: 'bg-danger-50 text-danger-500',
};

/** Unpacks the `{ label, … }` action descriptor into a real Button. */
const EmptyStateAction = ({ label, ...props }) => <Button {...props}>{label}</Button>;

export const EmptyState = ({
	icon = 'search',
	tone = 'neutral',
	title,
	description,
	action,
	secondaryAction,
	className,
	compact = false,
}) => (
	<div
		className={cn(
			'flex flex-col items-center justify-center rounded-card border border-dashed border-line-strong bg-white/60 text-center',
			compact ? 'px-6 py-10' : 'px-6 py-16',
			className,
		)}
	>
		<span
			className={cn(
				'flex h-12 w-12 items-center justify-center rounded-full',
				TONES[tone] ?? TONES.neutral,
			)}
		>
			<Icon name={icon} size="lg" />
		</span>

		<h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-ink-900">
			{title}
		</h3>

		{description && (
			<p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-500">{description}</p>
		)}

		{(action || secondaryAction) && (
			<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
				{action && <EmptyStateAction size="sm" {...action} />}
				{secondaryAction && (
					<EmptyStateAction size="sm" variant="ghost" {...secondaryAction} />
				)}
			</div>
		)}
	</div>
);

/** Convenience wrapper for failed requests. */
export const ErrorState = ({ message, onRetry, className }) => (
	<EmptyState
		icon="alert"
		tone="danger"
		title="We could not load this"
		description={message || 'Something went wrong on our side. Please try again.'}
		action={onRetry ? { label: 'Try again', onClick: onRetry, variant: 'secondary' } : undefined}
		className={className}
		compact
	/>
);
