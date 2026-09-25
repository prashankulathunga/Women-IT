import { useCallback } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { StatCard } from '../../components/ui/StatCard';
import { ROUTES } from '../../constants/routes';
import { useAsync } from '../../hooks/useAsync';
import { formatRelativeTime, toPercent } from '../../lib/format';
import { approvalService } from '../../services/approval.service';
import { SectionHeading } from './components/SectionHeading';

/** Dashboard for staff: the review queue is the whole job. */
export const AdminOverview = () => {
	const load = useCallback(
		() =>
			Promise.all([approvalService.stats(), approvalService.listPending()]).then(
				([stats, pending]) => ({ stats, pending }),
			),
		[],
	);

	const { data, error, isLoading, refetch } = useAsync(load, []);

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

	const { stats, pending } = data;
	const decided = stats.approved + stats.declined;

	return (
		<div className="space-y-10">
			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard
					label="Awaiting review"
					value={stats.pending}
					icon="clock"
					tone="warning"
					hint={stats.pending > 0 ? 'People are waiting' : 'Queue is clear'}
				/>
				<StatCard
					label="Approved"
					value={stats.approved}
					icon="check-circle"
					tone="success"
					hint="Active members"
				/>
				<StatCard
					label="Declined"
					value={stats.declined}
					icon="alert"
					tone="danger"
					hint="Can retake and resubmit"
				/>
				<StatCard
					label="Approval rate"
					value={`${toPercent(stats.approved, decided)}%`}
					icon="trending-up"
					tone="brand"
					hint={`${decided} decisions made`}
				/>
			</section>

			<section>
				<SectionHeading
					title="Waiting on you"
					description="Member signups cannot use Aruna until someone reviews their photo."
					to={ROUTES.adminApprovals}
					linkLabel="Open the queue"
				/>

				{pending.length > 0 ? (
					<div className="space-y-3">
						{pending.slice(0, 5).map((record) => (
							<Card
								key={record.id}
								padding="sm"
								className="flex flex-wrap items-center justify-between gap-4"
							>
								<div className="flex min-w-0 items-center gap-3">
									{record.photoDataUrl ? (
										<img
											src={record.photoDataUrl}
											alt=""
											className="h-11 w-11 shrink-0 rounded-lg object-cover"
										/>
									) : (
										<span className="h-11 w-11 shrink-0 rounded-lg bg-ink-100" />
									)}

									<div className="min-w-0">
										<p className="truncate text-sm font-semibold text-ink-900">
											{record.name}
										</p>
										<p className="truncate text-xs text-ink-400">
											Waiting {formatRelativeTime(record.signupAt)}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3">
									{record.resubmittedAt && (
										<Badge tone="info" size="sm">
											Resubmitted
										</Badge>
									)}
									<Button to={ROUTES.adminApprovals} size="xs" variant="secondary">
										Review
									</Button>
								</div>
							</Card>
						))}
					</div>
				) : (
					<EmptyState
						icon="check-circle"
						tone="brand"
						title="The queue is empty"
						description="New member signups appear here the moment someone submits their verification photo."
						compact
					/>
				)}
			</section>

			<section>
				<Card variant="muted" padding="lg">
					<CardHeader
						title="Why this gate exists"
						description="Aruna is a women-only professional community. The live capture is a light identity check — it is never shown on a member's public profile, and it is only visible to staff on this queue."
						action={
							<Button to={ROUTES.adminApprovals} size="sm">
								Review queue
							</Button>
						}
					/>
				</Card>
			</section>
		</div>
	);
};
