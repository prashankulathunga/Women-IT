import { useCallback, useMemo, useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import { SkeletonList } from '../../components/ui/Skeleton';
import { Tabs } from '../../components/ui/Tabs';
import { REQUEST_STATUS } from '../../constants/options';
import { ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { RequestCard } from '../../features/mentorship/components/RequestCard';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { mentorsService } from '../../services/mentors.service';

/**
 * One route, two perspectives: a member's outgoing requests, or a mentor's
 * incoming ones. The role decides which service call and which card mode.
 */
export const MentorshipPage = () => {
	const { user, role } = useAuth();
	const toast = useToast();

	const isMentor = role === ROLES.MENTOR;
	const [tab, setTab] = useState('pending');
	const [busyId, setBusyId] = useState(null);

	const load = useCallback(
		() =>
			isMentor
				? mentorsService.listForMentor(user.profile?.mentorDirectoryId)
				: mentorsService.listForMember(user.id),
		[isMentor, user.id, user.profile?.mentorDirectoryId],
	);

	const { data, error, isLoading, refetch } = useAsync(load, [user.id, isMentor], {
		initialData: [],
	});

	const grouped = useMemo(() => {
		const rows = data ?? [];
		return {
			pending: rows.filter((row) => row.status === REQUEST_STATUS.PENDING),
			accepted: rows.filter((row) => row.status === REQUEST_STATUS.ACCEPTED),
			closed: rows.filter((row) =>
				[REQUEST_STATUS.DECLINED, REQUEST_STATUS.COMPLETED].includes(row.status),
			),
		};
	}, [data]);

	const handleRespond = async (request, status) => {
		setBusyId(request.id);
		try {
			await mentorsService.respond(request.id, status);
			toast.success(
				status === REQUEST_STATUS.ACCEPTED
					? `You accepted ${request.userName}. They have been notified.`
					: `Request from ${request.userName} declined.`,
			);
			await refetch();
		} catch {
			toast.error('We could not update that request.');
		} finally {
			setBusyId(null);
		}
	};

	const handleCancel = async (request) => {
		setBusyId(request.id);
		try {
			await mentorsService.cancel(request.id, user.id);
			toast.info(`Request to ${request.mentorName} cancelled.`);
			await refetch();
		} catch {
			toast.error('We could not cancel that request.');
		} finally {
			setBusyId(null);
		}
	};

	const visible = grouped[tab] ?? [];

	return (
		<div>
			<PageHeader
				eyebrow="Mentorship"
				title={isMentor ? 'Mentee requests' : 'My mentor requests'}
				description={
					isMentor
						? 'People who have asked for your time, and what they want help with.'
						: 'Every mentorship request you have sent, and where it stands.'
				}
			/>

			<Tabs
				ariaLabel="Request status"
				value={tab}
				onChange={setTab}
				items={[
					{ value: 'pending', label: 'Pending', count: grouped.pending.length },
					{ value: 'accepted', label: 'Accepted', count: grouped.accepted.length },
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
					{visible.map((request) => (
						<RequestCard
							key={request.id}
							request={request}
							perspective={isMentor ? 'mentor' : 'member'}
							isBusy={busyId === request.id}
							onRespond={handleRespond}
							onCancel={isMentor ? undefined : handleCancel}
						/>
					))}
				</div>
			) : (
				<EmptyState
					icon="messages"
					title={
						isMentor
							? tab === 'pending'
								? 'No requests waiting'
								: 'Nothing here yet'
							: tab === 'pending'
								? 'No pending requests'
								: 'Nothing here yet'
					}
					description={
						isMentor
							? 'Requests appear here as soon as a member reaches out. A specific focus list makes that happen sooner.'
							: 'Find someone whose focus matches what you are working on, and send them a specific ask.'
					}
					action={
						isMentor
							? { label: 'Edit your profile', to: ROUTES.profile, variant: 'secondary' }
							: { label: 'Browse mentors', to: ROUTES.mentors }
					}
				/>
			)}
		</div>
	);
};
