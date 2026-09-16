import { useMemo, useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import { SkeletonList } from '../../components/ui/Skeleton';
import { Tabs } from '../../components/ui/Tabs';
import { APPLICATION_STATUS } from '../../constants/options';
import { ROUTES } from '../../constants/routes';
import { ApplicationCard } from '../../features/jobs/components/ApplicationCard';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { jobsService } from '../../services/jobs.service';

const ACTIVE_STATUSES = [
	APPLICATION_STATUS.SUBMITTED,
	APPLICATION_STATUS.IN_REVIEW,
	APPLICATION_STATUS.INTERVIEW,
];

export const ApplicationsPage = () => {
	const { user } = useAuth();
	const toast = useToast();

	const [tab, setTab] = useState('active');
	const [busyId, setBusyId] = useState(null);

	const { data, error, isLoading, refetch } = useAsync(
		() => jobsService.listApplications(user.id),
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

	const handleWithdraw = async (application) => {
		setBusyId(application.id);
		try {
			await jobsService.withdrawApplication(application.id, user.id);
			toast.info(`Withdrawn from ${application.jobTitle}.`);
			await refetch();
		} catch {
			toast.error('We could not withdraw that application.');
		} finally {
			setBusyId(null);
		}
	};

	const visible = grouped[tab] ?? [];

	return (
		<div>
			<PageHeader
				eyebrow="Opportunities"
				title="My applications"
				description="Everything you have applied to, and where each one stands."
			/>

			<Tabs
				ariaLabel="Application status"
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
					{visible.map((application) => (
						<ApplicationCard
							key={application.id}
							application={application}
							isWithdrawing={busyId === application.id}
							onWithdraw={tab === 'active' ? handleWithdraw : undefined}
						/>
					))}
				</div>
			) : (
				<EmptyState
					icon="clipboard"
					title={
						tab === 'active'
							? 'No applications in progress'
							: tab === 'offers'
								? 'No offers yet'
								: 'Nothing closed'
					}
					description={
						tab === 'active'
							? 'When you apply to a role it appears here with its current status.'
							: 'This list fills up as your applications move through each stage.'
					}
					action={
						tab === 'active'
							? { label: 'Browse the job board', to: ROUTES.jobs }
							: undefined
					}
				/>
			)}
		</div>
	);
};
