import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '../../components/icons/Icon';
import { PageHeader } from '../../components/layout/PageHeader';
import { Alert } from '../../components/ui/Alert';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/EmptyState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import {
	EMPLOYMENT_TYPES,
	EXPERIENCE_LEVELS,
	LOCATIONS,
	WORK_MODES,
	labelFor,
} from '../../constants/options';
import { ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { ApplyJobModal } from '../../features/jobs/components/ApplyJobModal';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../hooks/useAuth';
import { useDisclosure } from '../../hooks/useDisclosure';
import { useToast } from '../../hooks/useToast';
import {
	formatDate,
	formatRelativeTime,
	formatSalaryRange,
	hasClosed,
} from '../../lib/format';
import { jobsService } from '../../services/jobs.service';

const DetailRow = ({ icon, label, value }) => (
	<div className="flex items-start gap-3">
		<span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
			<Icon name={icon} />
		</span>
		<div className="min-w-0">
			<dt className="text-xs text-ink-400">{label}</dt>
			<dd className="mt-0.5 text-[13px] font-semibold text-ink-900">{value}</dd>
		</div>
	</div>
);

const BulletList = ({ title, items }) =>
	items?.length ? (
		<section>
			<h2 className="font-display text-lg font-semibold tracking-tight text-ink-900">
				{title}
			</h2>
			<ul className="mt-3 space-y-2.5">
				{items.map((item) => (
					<li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-600">
						<Icon name="check" size="sm" className="mt-0.5 shrink-0 text-brand-600" />
						{item}
					</li>
				))}
			</ul>
		</section>
	) : null;

export const JobDetailPage = () => {
	const { jobId } = useParams();
	const { user, role } = useAuth();
	const toast = useToast();
	const applyModal = useDisclosure();

	const [hasApplied, setHasApplied] = useState(false);
	const [isSaved, setIsSaved] = useState(false);

	const {
		data: job,
		error,
		isLoading,
		refetch,
	} = useAsync(() => jobsService.getById(jobId), [jobId]);

	useEffect(() => {
		let isActive = true;
		if (!user?.id || !jobId) return undefined;

		jobsService.hasApplied(jobId, user.id).then((applied) => {
			if (isActive) setHasApplied(applied);
		});

		return () => {
			isActive = false;
		};
	}, [jobId, user?.id]);

	const toggleSaved = useCallback(async () => {
		const next = await jobsService.toggleSaved(jobId, user.id);
		setIsSaved(next);
		toast.info(next ? 'Saved to your list.' : 'Removed from your saved roles.');
	}, [jobId, toast, user.id]);

	if (isLoading) return <SkeletonCard />;
	if (error) return <ErrorState message={error} onRetry={refetch} />;
	if (!job) return null;

	const canApply = role === ROLES.MEMBER;
	const isClosed = job.closed || hasClosed(job.closingAt);

	return (
		<div>
			<PageHeader
				backTo={ROUTES.jobs}
				backLabel="Back to job board"
				eyebrow={job.company}
				title={job.title}
				description={job.summary}
				actions={
					<>
						<Button
							variant="secondary"
							size="md"
							leadingIcon="bookmark"
							onClick={toggleSaved}
						>
							{isSaved ? 'Saved' : 'Save role'}
						</Button>

						{canApply && (
							<Button
								size="md"
								disabled={hasApplied || isClosed}
								leadingIcon={hasApplied ? 'check' : undefined}
								trailingIcon={hasApplied ? undefined : 'arrow-right'}
								onClick={applyModal.open}
							>
								{hasApplied
									? 'Application submitted'
									: isClosed
										? 'Applications closed'
										: 'Apply for this role'}
							</Button>
						)}
					</>
				}
			/>

			{isClosed && (
				<Alert tone="warning" title="This posting has closed" className="mb-6">
					Applications are no longer being accepted. Similar roles are on the job board.
				</Alert>
			)}

			<div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
				<div className="space-y-8">
					{job.womenFriendly?.length > 0 && (
						<Card variant="muted">
							<h2 className="flex items-center gap-2 font-display text-base font-semibold tracking-tight text-ink-900">
								<Icon name="heart" className="text-plum-600" />
								What this employer commits to
							</h2>
							<div className="mt-3 flex flex-wrap gap-2">
								{job.womenFriendly.map((perk) => (
									<Badge key={perk} tone="accent" size="lg">
										{perk}
									</Badge>
								))}
							</div>
						</Card>
					)}

					<BulletList title="What you will own" items={job.responsibilities} />
					<BulletList title="What they are looking for" items={job.requirements} />

					{job.skills?.length > 0 && (
						<section>
							<h2 className="font-display text-lg font-semibold tracking-tight text-ink-900">
								Skills
							</h2>
							<div className="mt-3 flex flex-wrap gap-2">
								{job.skills.map((skill) => (
									<Badge key={skill} tone="brand" size="lg">
										{skill}
									</Badge>
								))}
							</div>
						</section>
					)}

					{job.companyProfile && (
						<section>
							<h2 className="font-display text-lg font-semibold tracking-tight text-ink-900">
								About {job.companyProfile.name}
							</h2>
							<p className="mt-3 text-sm leading-relaxed text-ink-600">
								{job.companyProfile.about}
							</p>
							<div className="mt-4 flex flex-wrap gap-2">
								<Badge tone="outline" size="lg" icon="building">
									{job.companyProfile.industry}
								</Badge>
								<Badge tone="outline" size="lg" icon="users">
									{job.companyProfile.size}
								</Badge>
								<Badge tone="success" size="lg" icon="trending-up">
									{job.companyProfile.womenInTech}% women in tech roles
								</Badge>
							</div>
						</section>
					)}
				</div>

				<aside className="lg:sticky lg:top-24 lg:self-start">
					<Card>
						<p className="font-display text-xl font-semibold tracking-tight text-ink-900">
							{formatSalaryRange(job.salary)}
						</p>

						<dl className="mt-5 space-y-4 border-t border-line pt-5">
							<DetailRow
								icon="map-pin"
								label="Location"
								value={`${labelFor(LOCATIONS, job.location)} · ${labelFor(WORK_MODES, job.workMode)}`}
							/>
							<DetailRow
								icon="briefcase"
								label="Contract"
								value={labelFor(EMPLOYMENT_TYPES, job.employmentType)}
							/>
							<DetailRow
								icon="trending-up"
								label="Level"
								value={labelFor(EXPERIENCE_LEVELS, job.level)}
							/>
							<DetailRow
								icon="calendar"
								label="Closing date"
								value={formatDate(job.closingAt)}
							/>
							<DetailRow
								icon="users"
								label="Applicants so far"
								value={`${job.applicants ?? 0} people`}
							/>
						</dl>

						<p className="mt-5 border-t border-line pt-4 text-xs text-ink-400">
							Posted {formatRelativeTime(job.postedAt)}
						</p>

						{canApply && !hasApplied && !isClosed && (
							<Button
								fullWidth
								className="mt-4"
								onClick={applyModal.open}
								trailingIcon="arrow-right"
							>
								Apply for this role
							</Button>
						)}
					</Card>
				</aside>
			</div>

			{canApply && (
				<ApplyJobModal
					job={job}
					isOpen={applyModal.isOpen}
					onClose={applyModal.close}
					onApplied={() => setHasApplied(true)}
				/>
			)}
		</div>
	);
};
