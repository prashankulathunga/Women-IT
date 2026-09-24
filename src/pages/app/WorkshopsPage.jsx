import { useCallback, useEffect, useState } from 'react';
import { FilterBar } from '../../components/common/FilterBar';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { Tabs } from '../../components/ui/Tabs';
import { CAREER_TRACKS } from '../../constants/options';
import { RegisterWorkshopModal } from '../../features/learning/components/RegisterWorkshopModal';
import { WorkshopCard } from '../../features/learning/components/WorkshopCard';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../hooks/useAuth';
import { useDisclosure } from '../../hooks/useDisclosure';
import { useFilters } from '../../hooks/useFilters';
import { useToast } from '../../hooks/useToast';
import { formatDateTime } from '../../lib/format';
import { learningService } from '../../services/learning.service';

const FORMAT_OPTIONS = [
	{ value: 'online', label: 'Online' },
	{ value: 'hybrid', label: 'Hybrid' },
	{ value: 'in-person', label: 'In person' },
];

export const WorkshopsPage = () => {
	const { user } = useAuth();
	const toast = useToast();
	const registerModal = useDisclosure();

	const [tab, setTab] = useState('browse');
	const [selected, setSelected] = useState(null);
	const [enrolments, setEnrolments] = useState([]);
	const [busyId, setBusyId] = useState(null);

	const { search, setSearch, filters, setFilter, reset, query } = useFilters(
		{ track: '', format: '' },
		{ pageSize: 12 },
	);

	const { data, error, isLoading, refetch } = useAsync(
		() => learningService.listWorkshops(query),
		[query],
	);

	const loadEnrolments = useCallback(
		() => learningService.listEnrolments(user.id).then(setEnrolments),
		[user.id],
	);

	useEffect(() => {
		loadEnrolments();
	}, [loadEnrolments]);

	const registeredIds = enrolments.map((row) => row.workshopId);

	const openRegistration = (workshop) => {
		setSelected(workshop);
		registerModal.open();
	};

	const handleCancel = async (enrolment) => {
		setBusyId(enrolment.id);
		try {
			await learningService.cancelEnrolment(enrolment.id, user.id);
			toast.info(`Registration for "${enrolment.workshopTitle}" cancelled.`);
			await Promise.all([loadEnrolments(), refetch()]);
		} catch {
			toast.error('We could not cancel that registration.');
		} finally {
			setBusyId(null);
		}
	};

	return (
		<div>
			<PageHeader
				eyebrow="Gain up skills"
				title="Workshops"
				description="Interview clinics, negotiation practice and returnship programmes run with SLASSCOM, Women in Tech Sri Lanka and employer partners."
			/>

			<Tabs
				ariaLabel="Workshop views"
				value={tab}
				onChange={setTab}
				items={[
					{ value: 'browse', label: 'Upcoming', count: data?.total },
					{ value: 'mine', label: 'My registrations', count: enrolments.length },
				]}
				className="mb-6"
			/>

			{tab === 'browse' ? (
				<>
					<FilterBar
						search={search}
						onSearchChange={setSearch}
						searchPlaceholder="Search workshops by topic or facilitator"
						filters={[
							{ name: 'track', label: 'All specialisations', options: CAREER_TRACKS },
							{ name: 'format', label: 'All formats', options: FORMAT_OPTIONS },
						]}
						values={filters}
						onFilterChange={setFilter}
						onReset={reset}
						resultCount={data?.total}
						resultNoun="workshop"
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
						<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
							{data.items.map((workshop) => (
								<WorkshopCard
									key={workshop.id}
									workshop={workshop}
									isRegistered={registeredIds.includes(workshop.id)}
									onRegister={openRegistration}
								/>
							))}
						</div>
					) : (
						<EmptyState
							icon="sparkle"
							title="No workshops match those filters"
							description="New sessions are scheduled every month — try clearing the filters."
							action={{ label: 'Clear filters', onClick: reset, variant: 'secondary' }}
						/>
					)}
				</>
			) : enrolments.length > 0 ? (
				<div className="space-y-4">
					{enrolments.map((enrolment) => (
						<Card
							key={enrolment.id}
							className="flex flex-wrap items-center justify-between gap-4"
						>
							<div className="min-w-0">
								<h3 className="font-display text-base font-semibold tracking-tight text-ink-900">
									{enrolment.workshopTitle}
								</h3>
								<p className="mt-1 text-[13px] text-ink-500">
									{formatDateTime(enrolment.startsAt)} · {enrolment.facilitator} ·{' '}
									{enrolment.format}
								</p>
							</div>

							<Button
								variant="ghost"
								size="sm"
								isLoading={busyId === enrolment.id}
								onClick={() => handleCancel(enrolment)}
								className="text-danger-500 hover:bg-danger-50"
							>
								Cancel registration
							</Button>
						</Card>
					))}
				</div>
			) : (
				<EmptyState
					icon="calendar"
					title="You have not registered for anything yet"
					description="Seats on the interview and negotiation clinics go quickly — they run at a small enough size to get real feedback."
					action={{ label: 'Browse workshops', onClick: () => setTab('browse') }}
				/>
			)}

			<RegisterWorkshopModal
				workshop={selected}
				isOpen={registerModal.isOpen}
				onClose={registerModal.close}
				onRegistered={() => {
					loadEnrolments();
					refetch();
				}}
			/>
		</div>
	);
};
