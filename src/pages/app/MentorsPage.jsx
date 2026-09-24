import { FilterBar } from '../../components/common/FilterBar';
import { PageHeader } from '../../components/layout/PageHeader';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonList } from '../../components/ui/Skeleton';
import { CAREER_TRACKS, MENTORSHIP_GOALS } from '../../constants/options';
import { MentorCard } from '../../features/mentorship/components/MentorCard';
import { useAsync } from '../../hooks/useAsync';
import { useFilters } from '../../hooks/useFilters';
import { mentorsService } from '../../services/mentors.service';

const FACETS = [
	{ name: 'track', label: 'All specialisations', options: CAREER_TRACKS },
	{ name: 'focusArea', label: 'All focus areas', options: MENTORSHIP_GOALS },
	{
		name: 'availability',
		label: 'Any availability',
		options: [
			{ value: 'open', label: 'Open to new mentees' },
			{ value: 'limited', label: 'Limited availability' },
		],
	},
];

export const MentorsPage = () => {
	const { search, setSearch, filters, setFilter, setPage, reset, query } = useFilters(
		{ track: '', focusArea: '', availability: '' },
		{ pageSize: 6 },
	);

	const { data, error, isLoading, refetch } = useAsync(
		() => mentorsService.list(query),
		[query],
	);

	return (
		<div>
			<PageHeader
				eyebrow="Mentorship"
				title="Find a mentor"
				description="Senior women in Sri Lankan tech who volunteer their time. Pick someone whose focus matches the thing you are actually stuck on."
			/>

			<FilterBar
				search={search}
				onSearchChange={setSearch}
				searchPlaceholder="Search by name, company or expertise"
				filters={FACETS}
				values={filters}
				onFilterChange={setFilter}
				onReset={reset}
				resultCount={data?.total}
				resultNoun="mentor"
				className="mb-6"
			/>

			{isLoading ? (
				<SkeletonList count={3} />
			) : error ? (
				<ErrorState message={error} onRetry={refetch} />
			) : data?.items.length > 0 ? (
				<>
					<div className="grid gap-4 lg:grid-cols-2">
						{data.items.map((mentor) => (
							<MentorCard key={mentor.id} mentor={mentor} />
						))}
					</div>

					<Pagination
						page={data.page}
						totalPages={data.totalPages}
						onChange={setPage}
						className="mt-8"
					/>
				</>
			) : (
				<EmptyState
					icon="compass"
					title="No mentors match those filters"
					description="Try a different focus area — our mentors cover engineering, data, product, design, security and delivery."
					action={{ label: 'Clear filters', onClick: reset, variant: 'secondary' }}
				/>
			)}
		</div>
	);
};
