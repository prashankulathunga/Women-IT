import { cn } from '../../lib/cn';

/**
 * Surface primitive.
 *
 * `interactive` adds the lift-on-hover treatment used by every clickable card
 * (jobs, mentors, workshops) so the whole product hovers identically.
 */
const VARIANTS = {
	default: 'bg-white border border-line',
	muted: 'bg-surface-muted border border-line',
	outline: 'bg-transparent border border-line-strong',
	brand: 'bg-brand-900 border border-brand-900 text-white',
	elevated: 'bg-white border border-line shadow-raised',
};

const PADDING = {
	none: '',
	sm: 'p-4',
	md: 'p-5 sm:p-6',
	lg: 'p-6 sm:p-8',
};

export const Card = ({
	as: Component = 'div',
	variant = 'default',
	padding = 'md',
	interactive = false,
	className,
	children,
	...props
}) => (
	<Component
		className={cn(
			// `min-w-0` matters: as a grid or flex item a card defaults to
			// min-width:auto, which lets its longest unbreakable content push the
			// card past its track and scroll the whole page sideways on mobile.
			'min-w-0 rounded-card transition-all duration-200',
			VARIANTS[variant] ?? VARIANTS.default,
			PADDING[padding] ?? PADDING.md,
			interactive &&
				'hover:-translate-y-0.5 hover:border-line-strong hover:shadow-raised focus-within:border-brand-300',
			className,
		)}
		{...props}
	>
		{children}
	</Component>
);

export const CardHeader = ({ title, description, action, className }) => (
	<div className={cn('flex items-start justify-between gap-4', className)}>
		<div className="min-w-0">
			<h3 className="font-display text-lg font-semibold tracking-tight text-ink-900">
				{title}
			</h3>
			{description && (
				<p className="mt-1 text-[13px] leading-relaxed text-ink-500">{description}</p>
			)}
		</div>
		{action && <div className="shrink-0">{action}</div>}
	</div>
);
