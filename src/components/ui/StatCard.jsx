import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/** Dashboard KPI tile. */
const TONES = {
	brand: 'bg-brand-50 text-brand-800',
	accent: 'bg-plum-50 text-plum-700',
	success: 'bg-success-50 text-success-700',
	warning: 'bg-warning-50 text-warning-700',
	info: 'bg-info-50 text-info-700',
	neutral: 'bg-ink-100 text-ink-600',
};

export const StatCard = ({
	label,
	value,
	icon,
	tone = 'brand',
	delta,
	deltaLabel,
	hint,
	className,
}) => {
	const isPositive = typeof delta === 'number' && delta >= 0;

	return (
		<div
			className={cn(
				'rounded-card border border-line bg-white p-5 transition-shadow hover:shadow-subtle',
				className,
			)}
		>
			<div className="flex items-start justify-between gap-3">
				<p className="text-[13px] font-medium text-ink-500">{label}</p>
				{icon && (
					<span
						className={cn(
							'flex h-8 w-8 items-center justify-center rounded-lg',
							TONES[tone] ?? TONES.brand,
						)}
					>
						<Icon name={icon} />
					</span>
				)}
			</div>

			<p className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900 tabular-nums">
				{value}
			</p>

			{(delta !== undefined || hint) && (
				<div className="mt-2 flex items-center gap-1.5 text-xs">
					{delta !== undefined && (
						<span
							className={cn(
								'inline-flex items-center gap-1 font-semibold',
								isPositive ? 'text-success-700' : 'text-danger-500',
							)}
						>
							<Icon
								name="trending-up"
								size="xs"
								className={cn(!isPositive && '-scale-y-100')}
							/>
							{isPositive ? '+' : ''}
							{delta}
							{deltaLabel ? ` ${deltaLabel}` : ''}
						</span>
					)}
					{hint && <span className="text-ink-400">{hint}</span>}
				</div>
			)}
		</div>
	);
};
