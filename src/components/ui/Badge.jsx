import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/** Status and metadata pill. `tone` maps to the status vocabulary in options.js. */
const TONES = {
	neutral: 'bg-ink-100 text-ink-700 ring-ink-200',
	brand: 'bg-brand-50 text-brand-900 ring-brand-200',
	accent: 'bg-plum-50 text-plum-700 ring-plum-200',
	success: 'bg-success-50 text-success-700 ring-success-500/20',
	warning: 'bg-warning-50 text-warning-700 ring-warning-500/20',
	danger: 'bg-danger-50 text-danger-700 ring-danger-500/20',
	info: 'bg-info-50 text-info-700 ring-info-500/20',
	inverse: 'bg-brand-900 text-white ring-brand-900',
	outline: 'bg-transparent text-ink-600 ring-line-strong',
};

const SIZES = {
	sm: 'h-5 px-2 text-[11px] gap-1',
	md: 'h-6 px-2.5 text-xs gap-1.5',
	lg: 'h-7 px-3 text-[13px] gap-1.5',
};

export const Badge = ({
	tone = 'neutral',
	size = 'md',
	icon,
	dot = false,
	className,
	children,
	...props
}) => (
	<span
		className={cn(
			'inline-flex items-center rounded-full font-semibold whitespace-nowrap ring-1 ring-inset',
			TONES[tone] ?? TONES.neutral,
			SIZES[size] ?? SIZES.md,
			className,
		)}
		{...props}
	>
		{dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />}
		{icon && <Icon name={icon} size="xs" />}
		{children}
	</span>
);
