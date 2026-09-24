import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/**
 * Page control with ellipsis windowing.
 * Renders nothing for single-page results so callers can mount it
 * unconditionally.
 */
const buildPages = (current, total) => {
	if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

	const pages = [1];
	const start = Math.max(2, current - 1);
	const end = Math.min(total - 1, current + 1);

	if (start > 2) pages.push('start-gap');
	for (let page = start; page <= end; page += 1) pages.push(page);
	if (end < total - 1) pages.push('end-gap');

	pages.push(total);
	return pages;
};

export const Pagination = ({ page = 1, totalPages = 1, onChange, className }) => {
	if (totalPages <= 1) return null;

	const stepClasses =
		'flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-[13px] font-semibold transition-colors disabled:pointer-events-none disabled:opacity-40';

	return (
		<nav
			aria-label="Pagination"
			className={cn('flex items-center justify-center gap-1', className)}
		>
			<button
				type="button"
				onClick={() => onChange?.(page - 1)}
				disabled={page <= 1}
				aria-label="Previous page"
				className={cn(stepClasses, 'text-ink-600 hover:bg-ink-100')}
			>
				<Icon name="chevron-left" />
			</button>

			{buildPages(page, totalPages).map((entry) =>
				typeof entry === 'number' ? (
					<button
						key={entry}
						type="button"
						onClick={() => onChange?.(entry)}
						aria-current={entry === page ? 'page' : undefined}
						className={cn(
							stepClasses,
							entry === page
								? 'bg-brand-900 text-white'
								: 'text-ink-600 hover:bg-ink-100',
						)}
					>
						{entry}
					</button>
				) : (
					<span
						key={entry}
						aria-hidden="true"
						className="flex h-9 w-6 items-center justify-center text-ink-400"
					>
						…
					</span>
				),
			)}

			<button
				type="button"
				onClick={() => onChange?.(page + 1)}
				disabled={page >= totalPages}
				aria-label="Next page"
				className={cn(stepClasses, 'text-ink-600 hover:bg-ink-100')}
			>
				<Icon name="chevron-right" />
			</button>
		</nav>
	);
};
