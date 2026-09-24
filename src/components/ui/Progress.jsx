import { cn } from '../../lib/cn';

/** Linear progress meter: profile completion, workshop seats, form steps. */
const TONES = {
	brand: 'bg-brand-900',
	accent: 'bg-plum-600',
	success: 'bg-success-500',
	warning: 'bg-warning-500',
	danger: 'bg-danger-500',
};

const SIZES = {
	xs: 'h-1',
	sm: 'h-1.5',
	md: 'h-2',
	lg: 'h-2.5',
};

export const Progress = ({
	value = 0,
	max = 100,
	tone = 'brand',
	size = 'sm',
	label,
	showValue = false,
	className,
}) => {
	const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

	return (
		<div className={cn('w-full', className)}>
			{(label || showValue) && (
				<div className="mb-1.5 flex items-baseline justify-between gap-3">
					{label && (
						<span className="text-xs font-semibold text-ink-700">{label}</span>
					)}
					{showValue && (
						<span className="text-xs font-semibold tabular-nums text-ink-500">
							{Math.round(percent)}%
						</span>
					)}
				</div>
			)}

			<div
				role="progressbar"
				aria-valuenow={Math.round(percent)}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-label={label || 'Progress'}
				className={cn(
					'w-full overflow-hidden rounded-full bg-ink-200',
					SIZES[size] ?? SIZES.sm,
				)}
			>
				<div
					className={cn(
						'h-full rounded-full transition-[width] duration-500 ease-out',
						TONES[tone] ?? TONES.brand,
					)}
					style={{ width: `${percent}%` }}
				/>
			</div>
		</div>
	);
};
