import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { StatCard } from '../../components/ui/StatCard';
import { APPLICATION_STATUS, APPLICATION_STATUS_META } from '../../constants/options';
import { ROUTES } from '../../constants/routes';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../hooks/useAuth';
import { formatRelativeTime } from '../../lib/format';
import { jobsService } from '../../services/jobs.service';
import { SectionHeading } from './components/SectionHeading';

/** Dashboard for employer partners. */
export const CompanyOverview = () => {
	const { user } = useAuth();

	const load = useCallback(
		() =>
			Promise.all([
				jobsService.listPostings(user.id),
				jobsService.listApplicants(user.id),
			]).then(([postings, applicants]) => ({ postings, applicants })),
		[user.id],
	);

	const { data, error, isLoading, refetch } = useAsync(load, [user.id]);

	if (isLoading) {
		return (
			<div className="space-y-4">
				<SkeletonCard />
				<SkeletonCard />
			</div>
		);
	}

	if (error) return <ErrorState message={error} onRetry={refetch} />;
	if (!data) return null;

	const openPostings = data.postings.filter((posting) => !posting.closed);
	const newApplicants = data.applicants.filter(
		(row) => row.status === APPLICATION_STATUS.SUBMITTED,
	);

	return (
		<div className="space-y-10">
			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard
					label="Open roles"
					value={openPostings.length}
					icon="briefcase"
					tone="brand"
					hint={`${data.postings.length} posted in total`}
				/>
				<StatCard
					label="Total applicants"
					value={data.applicants.length}
					icon="users"
					tone="success"
					hint="Across all postings"
				/>
				<StatCard
					label="Awaiting review"
					value={newApplicants.length}
					icon="clipboard"
					tone="warning"
					hint={newApplicants.length > 0 ? 'Needs your attention' : 'All reviewed'}
				/>
				<StatCard
					label="Hiring tracks"
					value={user.profile?.hiringFocus?.length ?? 0}
					icon="compass"
					tone="info"
					hint="Drives who sees your roles"
				/>
			</section>

			<section>
				<SectionHeading
					title="Your postings"
					description="Roles currently live on the Aruna job board."
					to={ROUTES.companyPostings}
					linkLabel="Manage postings"
				/>

				{openPostings.length > 0 ? (
					<div className="space-y-3">
						{openPostings.slice(0, 4).map((posting) => (
							<Card
								key={posting.id}
								className="flex flex-wrap items-center justify-between gap-4"
								padding="sm"
							>
								<div className="min-w-0">
									<h3 className="truncate font-display text-base font-semibold tracking-tight text-ink-900">
										<Link
											to={ROUTES.jobDetail(posting.id)}
											className="hover:text-brand-900 hover:underline"
										>
											{posting.title}
										</Link>
									</h3>
									<p className="mt-0.5 text-xs text-ink-400">
										Posted {formatRelativeTime(posting.postedAt)}
									</p>
								</div>

								<div className="flex items-center gap-3">
									<Badge tone="brand" size="md">
										{posting.applicationCount} applicants
									</Badge>
									<Button
										to={ROUTES.companyApplicants}
										size="xs"
										variant="secondary"
									>
										Review
									</Button>
								</div>
							</Card>
						))}
					</div>
				) : (
					<EmptyState
						icon="briefcase"
						tone="brand"
						title="No live roles yet"
						description="Post your first role to reach experienced women technologists across Sri Lanka."
						action={{ label: 'Post a role', to: ROUTES.companyPostings }}
						compact
					/>
				)}
			</section>

			<section>
				<SectionHeading
					title="Latest applicants"
					description="Newest first, across every posting."
					to={ROUTES.companyApplicants}
					linkLabel="All applicants"
				/>

				{data.applicants.length > 0 ? (
					<div className="space-y-3">
						{data.applicants.slice(0, 4).map((applicant) => {
							const status = APPLICATION_STATUS_META[applicant.status];
							return (
								<Card
									key={applicant.id}
									padding="sm"
									className="flex flex-wrap items-center justify-between gap-4"
								>
									<div className="min-w-0">
										<p className="truncate text-sm font-semibold text-ink-900">
											{applicant.jobTitle}
										</p>
										<p className="mt-0.5 text-xs text-ink-400">
											Applied {formatRelativeTime(applicant.appliedAt)}
										</p>
									</div>
									<Badge tone={status?.tone ?? 'neutral'} size="md" dot>
										{status?.label ?? applicant.status}
									</Badge>
								</Card>
							);
						})}
					</div>
				) : (
					<EmptyState
						icon="users"
						title="No applications yet"
						description="Applications appear here the moment someone applies to one of your roles."
						compact
					/>
				)}
			</section>

			<section>
				<Card variant="muted" padding="lg">
					<CardHeader
						title="Make your postings work harder"
						description="Roles that state salary band, work mode and parental-leave policy get about twice the applications on Aruna."
						action={
							<Button to={ROUTES.companyPostings} size="sm">
								Post a role
							</Button>
						}
					/>
				</Card>
			</section>
		</div>
	);
};
