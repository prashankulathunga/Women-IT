import { FilterBar } from '../../components/common/FilterBar';
import { PageHeader } from '../../components/layout/PageHeader';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonList } from '../../components/ui/Skeleton';
import {
	CAREER_TRACKS,
	EMPLOYMENT_TYPES,
	EXPERIENCE_LEVELS,
	WORK_MODES,
} from '../../constants/options';
import { JobCard } from '../../features/jobs/components/JobCard';
import { useAsync } from '../../hooks/useAsync';
import { useFilters } from '../../hooks/useFilters';
import { JOB_SORT_OPTIONS, jobsService } from '../../services/jobs.service';

const FACETS = [
	{ name: 'track', label: 'All specialisations', options: CAREER_TRACKS },
	{ name: 'level', label: 'All levels', options: EXPERIENCE_LEVELS },
	{ name: 'workMode', label: 'All work modes', options: WORK_MODES },
	{ name: 'employmentType', label: 'All contract types', options: EMPLOYMENT_TYPES },
];

/** The job board: search, facets, pagination. */
export const JobsPage = () => {
	const { search, setSearch, filters, setFilter, setPage, reset, query } =
		useFilters(
			{ track: '', level: '', workMode: '', employmentType: '', sort: 'recent' },
			{ pageSize: 6 },
		);

	const { data, error, isLoading, refetch } = useAsync(
		() => jobsService.list(query),
		[query],
	);

	return (
		<div>
			<PageHeader
				eyebrow="Opportunities"
				title="Job board"
				description="Roles from employer partners who state work mode, salary band and the policies that actually matter."
			/>

			<FilterBar
				search={search}
				onSearchChange={setSearch}
				searchPlaceholder="Search by role, company or skill"
				filters={[
					...FACETS,
					{
						name: 'sort',
						label: 'Sort by',
						options: JOB_SORT_OPTIONS,
						allowEmpty: false,
					},
				]}
				values={filters}
				onFilterChange={setFilter}
				onReset={reset}
				resultCount={data?.total}
				resultNoun="role"
				className="mb-6"
			/>

			{isLoading ? (
				<SkeletonList count={3} />
			) : error ? (
				<ErrorState message={error} onRetry={refetch} />
			) : data?.items.length > 0 ? (
				<>
					<div className="space-y-4">
						{data.items.map((job) => (
							<JobCard key={job.id} job={job} />
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
					icon="briefcase"
					title="No roles match those filters"
					description="Try widening the specialisation or clearing the work-mode filter — new roles are added every week."
					action={{ label: 'Clear filters', onClick: reset, variant: 'secondary' }}
				/>
			)}
		</div>
	);
};
