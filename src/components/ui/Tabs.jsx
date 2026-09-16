import { cn } from '../../lib/cn';
import { Badge } from './Badge';

/**
 * Controlled tab strip used for in-page view switching.
 * `variant="segment"` is the pill control used inside forms and auth screens;
 * `variant="underline"` is the page-level tab bar.
 */
export const Tabs = ({
	items = [],
	value,
	onChange,
	variant = 'underline',
	className,
	ariaLabel = 'Views',
}) => {
	if (variant === 'segment') {
		return (
			<div
				role="tablist"
				aria-label={ariaLabel}
				className={cn(
					'inline-grid w-full gap-1 rounded-field bg-ink-100 p-1',
					className,
				)}
				style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
			>
				{items.map((item) => {
					const isActive = item.value === value;
					return (
						<button
							key={item.value}
							type="button"
							role="tab"
							aria-selected={isActive}
							onClick={() => onChange?.(item.value)}
							className={cn(
								'flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold transition-all duration-150',
								isActive
									? 'bg-white text-ink-900 shadow-subtle'
									: 'text-ink-500 hover:text-ink-800',
							)}
						>
							{item.label}
						</button>
					);
				})}
			</div>
		);
	}

	return (
		<div
			role="tablist"
			aria-label={ariaLabel}
			className={cn(
				'scrollbar-none -mb-px flex gap-1 overflow-x-auto border-b border-line',
				className,
			)}
		>
			{items.map((item) => {
				const isActive = item.value === value;
				return (
					<button
						key={item.value}
						type="button"
						role="tab"
						aria-selected={isActive}
						onClick={() => onChange?.(item.value)}
						className={cn(
							'flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors',
							isActive
								? 'border-brand-900 text-brand-900'
								: 'border-transparent text-ink-500 hover:border-line-strong hover:text-ink-800',
						)}
					>
						{item.label}
						{item.count !== undefined && (
							<Badge tone={isActive ? 'brand' : 'neutral'} size="sm">
								{item.count}
							</Badge>
						)}
					</button>
				);
			})}
		</div>
	);
};
