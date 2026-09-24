import { useMemo, useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Icon } from '../../components/icons/Icon';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import { Select } from '../../components/ui/Select';
import { SkeletonList } from '../../components/ui/Skeleton';
import { Tabs } from '../../components/ui/Tabs';
import { APPLICATION_STATUS, APPLICATION_STATUS_META } from '../../constants/options';
import { ROUTES } from '../../constants/routes';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { formatCurrency, formatRelativeTime } from '../../lib/format';
import { jobsService } from '../../services/jobs.service';

const STATUS_OPTIONS = Object.entries(APPLICATION_STATUS_META).map(([value, meta]) => ({
	value,
	label: meta.label,
}));

const ACTIVE_STATUSES = [
	APPLICATION_STATUS.SUBMITTED,
	APPLICATION_STATUS.IN_REVIEW,
	APPLICATION_STATUS.INTERVIEW,
];

export const CompanyApplicantsPage = () => {
	const { user } = useAuth();
	const toast = useToast();
	const [tab, setTab] = useState('active');
	const [busyId, setBusyId] = useState(null);

	const { data, error, isLoading, refetch } = useAsync(
		() => jobsService.listApplicants(user.id),
		[user.id],
		{ initialData: [] },
	);

	const grouped = useMemo(() => {
		const rows = data ?? [];
		return {
			active: rows.filter((row) => ACTIVE_STATUSES.includes(row.status)),
			offers: rows.filter((row) => row.status === APPLICATION_STATUS.OFFER),
			closed: rows.filter((row) => row.status === APPLICATION_STATUS.CLOSED),
		};
	}, [data]);

	const handleStatusChange = async (application, status) => {
		setBusyId(application.id);
		try {
			await jobsService.updateApplicationStatus(application.id, status);
			toast.success(
				`Moved to ${APPLICATION_STATUS_META[status]?.label ?? status}. The candidate is notified.`,
			);
			await refetch();
		} catch {
			toast.error('We could not update that application.');
		} finally {
			setBusyId(null);
		}
	};

	const visible = grouped[tab] ?? [];

	return (
		<div>
			<PageHeader
				eyebrow="Opportunities"
				title="Applicants"
				description="Everyone who has applied to one of your roles, newest first."
			/>

			<Tabs
				ariaLabel="Applicant status"
				value={tab}
				onChange={setTab}
				items={[
					{ value: 'active', label: 'In progress', count: grouped.active.length },
					{ value: 'offers', label: 'Offers', count: grouped.offers.length },
					{ value: 'closed', label: 'Closed', count: grouped.closed.length },
				]}
				className="mb-6"
			/>

			{isLoading ? (
				<SkeletonList count={2} />
			) : error ? (
				<ErrorState message={error} onRetry={refetch} />
			) : visible.length > 0 ? (
				<div className="space-y-4">
					{visible.map((application) => {
						const status = APPLICATION_STATUS_META[application.status];

						return (
							<Card key={application.id}>
								<div className="flex items-start gap-4">
									<Avatar name={application.userName || 'Candidate'} size="md" />

									<div className="min-w-0 flex-1">
										<div className="flex flex-wrap items-center gap-2.5">
											<h3 className="font-display text-base font-semibold tracking-tight text-ink-900">
												{application.jobTitle}
											</h3>
											<Badge tone={status?.tone ?? 'neutral'} size="sm" dot>
												{status?.label ?? application.status}
											</Badge>
										</div>

										<p className="mt-3 rounded-field bg-surface-muted px-3.5 py-3 text-[13px] leading-relaxed text-ink-600">
											{application.coverNote}
										</p>

										<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-400">
											<span className="inline-flex items-center gap-1.5">
												<Icon name="clock" size="xs" />
												Applied {formatRelativeTime(application.appliedAt)}
											</span>
											{application.expectedSalary && (
												<span className="inline-flex items-center gap-1.5">
													<Icon name="trending-up" size="xs" />
													Expects {formatCurrency(Number(application.expectedSalary))}
												</span>
											)}
											{application.availability && (
												<span className="inline-flex items-center gap-1.5">
													<Icon name="calendar" size="xs" />
													Available: {application.availability}
												</span>
											)}
										</div>
									</div>
								</div>

								<div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
									<p className="text-xs text-ink-400">
										Application {application.id}
									</p>

									<div className="w-full sm:w-56">
										<Select
											aria-label="Move application to"
											options={STATUS_OPTIONS}
											allowEmpty={false}
											size="sm"
											disabled={busyId === application.id}
											value={application.status}
											onChange={(event) =>
												handleStatusChange(application, event.target.value)
											}
										/>
									</div>
								</div>
							</Card>
						);
					})}
				</div>
			) : (
				<EmptyState
					icon="users"
					title="No applicants in this stage"
					description="Applications land here the moment someone applies to one of your live roles."
					action={{ label: 'Manage postings', to: ROUTES.companyPostings }}
				/>
			)}
		</div>
	);
};
