import { Icon } from '../icons/Icon';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { cn } from '../../lib/cn';

/**
 * Search + faceted filter bar shared by the job board, mentor directory and
 * workshop listing.
 *
 * Driven by a `filters` descriptor so each page declares its facets as data
 * rather than re-implementing the layout.
 */
export const FilterBar = ({
	search,
	onSearchChange,
	searchPlaceholder = 'Search',
	filters = [],
	values = {},
	onFilterChange,
	onReset,
	resultCount,
	resultNoun = 'result',
	className,
}) => {
	// Facets that always carry a value (sort order) are not "active filters",
	// so they never contribute to the clear-filters count.
	const activeCount = filters.filter(
		(filter) => filter.allowEmpty !== false && values[filter.name],
	).length;

	return (
		<div className={cn('space-y-4', className)}>
			<div className="flex flex-col gap-3 sm:flex-row">
				<div className="relative flex-1">
					<Icon
						name="search"
						className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
					/>
					<input
						type="search"
						value={search}
						onChange={(event) => onSearchChange?.(event.target.value)}
						placeholder={searchPlaceholder}
						aria-label={searchPlaceholder}
						className="h-11 w-full rounded-field border border-line-strong bg-white pl-10 pr-3.5 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-400 hover:border-ink-300 focus:border-brand-600 focus:ring-4 focus:ring-brand-600/12"
					/>
				</div>

				{(activeCount > 0 || search) && (
					<Button variant="ghost" size="md" onClick={onReset} leadingIcon="close">
						Clear
						{activeCount > 0 ? ` (${activeCount})` : ''}
					</Button>
				)}
			</div>

			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				{filters.map((filter) => (
					<Select
						key={filter.name}
						aria-label={filter.label}
						placeholder={filter.label}
						options={filter.options}
						value={values[filter.name] ?? ''}
						onChange={(event) => onFilterChange?.(filter.name, event.target.value)}
						allowEmpty={filter.allowEmpty !== false}
						size="sm"
					/>
				))}
			</div>

			{resultCount !== undefined && (
				<p className="text-[13px] text-ink-500">
					<span className="font-semibold text-ink-900">{resultCount}</span>{' '}
					{resultCount === 1 ? resultNoun : `${resultNoun}s`} found
				</p>
			)}
		</div>
	);
};
