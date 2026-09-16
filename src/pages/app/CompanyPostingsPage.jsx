import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Icon } from '../../components/icons/Icon';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import { SkeletonList } from '../../components/ui/Skeleton';
import {
	EMPLOYMENT_TYPES,
	EXPERIENCE_LEVELS,
	LOCATIONS,
	WORK_MODES,
	labelFor,
} from '../../constants/options';
import { ROUTES } from '../../constants/routes';
import { PostJobModal } from '../../features/jobs/components/PostJobModal';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../hooks/useAuth';
import { useDisclosure } from '../../hooks/useDisclosure';
import { useToast } from '../../hooks/useToast';
import { formatDate, formatRelativeTime, formatSalaryRange } from '../../lib/format';
import { jobsService } from '../../services/jobs.service';

export const CompanyPostingsPage = () => {
	const { user } = useAuth();
	const toast = useToast();
	const postModal = useDisclosure();
	const [busyId, setBusyId] = useState(null);

	const { data, error, isLoading, refetch } = useAsync(
		() => jobsService.listPostings(user.id),
		[user.id],
		{ initialData: [] },
	);

	const handleClose = async (posting) => {
		setBusyId(posting.id);
		try {
			await jobsService.closePosting(posting.id, user.id);
			toast.info(`"${posting.title}" is no longer accepting applications.`);
			await refetch();
		} catch {
			toast.error('We could not close that posting.');
		} finally {
			setBusyId(null);
		}
	};

	return (
		<div>
			<PageHeader
				eyebrow="Opportunities"
				title="Job postings"
				description="Roles you have published to the Aruna job board."
				actions={
					<Button leadingIcon="plus" onClick={postModal.open}>
						Post a role
					</Button>
				}
			/>

			{isLoading ? (
				<SkeletonList count={2} />
			) : error ? (
				<ErrorState message={error} onRetry={refetch} />
			) : data.length > 0 ? (
				<div className="space-y-4">
					{data.map((posting) => (
						<Card key={posting.id}>
							<div className="flex flex-wrap items-start justify-between gap-4">
								<div className="min-w-0">
									<div className="flex flex-wrap items-center gap-2.5">
										<h3 className="font-display text-base font-semibold tracking-tight text-ink-900">
											<Link
												to={ROUTES.jobDetail(posting.id)}
												className="hover:text-brand-900 hover:underline"
											>
												{posting.title}
											</Link>
										</h3>
										<Badge tone={posting.closed ? 'neutral' : 'success'} size="sm" dot>
											{posting.closed ? 'Closed' : 'Live'}
										</Badge>
									</div>

									<div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-500">
										<span className="inline-flex items-center gap-1.5">
											<Icon name="map-pin" size="xs" className="text-ink-400" />
											{labelFor(LOCATIONS, posting.location)} ·{' '}
											{labelFor(WORK_MODES, posting.workMode)}
										</span>
										<span className="inline-flex items-center gap-1.5">
											<Icon name="briefcase" size="xs" className="text-ink-400" />
											{labelFor(EMPLOYMENT_TYPES, posting.employmentType)}
										</span>
										<span className="inline-flex items-center gap-1.5">
											<Icon name="trending-up" size="xs" className="text-ink-400" />
											{labelFor(EXPERIENCE_LEVELS, posting.level)}
										</span>
									</div>

									<p className="mt-3 text-[13px] font-semibold text-ink-900">
										{formatSalaryRange(posting.salary)}
									</p>
								</div>

								<div className="flex flex-col items-end gap-2">
									<Badge tone="brand" size="lg">
										{posting.applicationCount} applicants
									</Badge>
									<p className="text-xs text-ink-400">
										Closes {formatDate(posting.closingAt)}
									</p>
								</div>
							</div>

							<div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
								<p className="text-xs text-ink-400">
									Posted {formatRelativeTime(posting.postedAt)}
								</p>

								<div className="flex items-center gap-2">
									<Button
										to={ROUTES.companyApplicants}
										variant="secondary"
										size="sm"
									>
										Review applicants
									</Button>

									{!posting.closed && (
										<Button
											variant="ghost"
											size="sm"
											isLoading={busyId === posting.id}
											onClick={() => handleClose(posting)}
											className="text-danger-500 hover:bg-danger-50"
										>
											Close posting
										</Button>
									)}
								</div>
							</div>
						</Card>
					))}
				</div>
			) : (
				<EmptyState
					icon="briefcase"
					tone="brand"
					title="You have not posted a role yet"
					description="Aruna members are mid-to-senior women already working in Sri Lankan IT. State your salary band and work mode and you will hear from them."
					action={{ label: 'Post your first role', onClick: postModal.open }}
				/>
			)}

			<PostJobModal
				isOpen={postModal.isOpen}
				onClose={postModal.close}
				onCreated={refetch}
			/>
		</div>
	);
};
