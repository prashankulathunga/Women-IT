import { FilterBar } from '../../components/common/FilterBar';
import { PageHeader } from '../../components/layout/PageHeader';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { BLOG_CATEGORIES } from '../../data/learning';
import { BlogCard } from '../../features/learning/components/BlogCard';
import { useAsync } from '../../hooks/useAsync';
import { useFilters } from '../../hooks/useFilters';
import { learningService } from '../../services/learning.service';

export const BlogsPage = () => {
	const { search, setSearch, filters, setFilter, setPage, reset, query } = useFilters(
		{ category: '' },
		{ pageSize: 6 },
	);

	const { data, error, isLoading, refetch } = useAsync(
		() => learningService.listBlogs(query),
		[query],
	);

	return (
		<div>
			<PageHeader
				eyebrow="Gain up skills"
				title="Blogs & career stories"
				description="Honest accounts from women a few steps ahead — what worked, what did not, and what they would not repeat."
			/>

			<FilterBar
				search={search}
				onSearchChange={setSearch}
				searchPlaceholder="Search articles by title, author or topic"
				filters={[
					{ name: 'category', label: 'All categories', options: BLOG_CATEGORIES },
				]}
				values={filters}
				onFilterChange={setFilter}
				onReset={reset}
				resultCount={data?.total}
				resultNoun="article"
				className="mb-6"
			/>

			{isLoading ? (
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{Array.from({ length: 3 }).map((_, index) => (
						<SkeletonCard key={index} />
					))}
				</div>
			) : error ? (
				<ErrorState message={error} onRetry={refetch} />
			) : data?.items.length > 0 ? (
				<>
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{data.items.map((post) => (
							<BlogCard key={post.slug} post={post} />
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
					icon="book"
					title="No articles match that search"
					description="Try a different category — we publish career stories, leadership, technical craft and negotiation."
					action={{ label: 'Clear filters', onClick: reset, variant: 'secondary' }}
				/>
			)}
		</div>
	);
};
