import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '../../components/icons/Icon';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/EmptyState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import {
	CAREER_TRACKS,
	EXPERIENCE_LEVELS,
	LOCATIONS,
	MENTORSHIP_GOALS,
	REQUEST_STATUS,
	labelFor,
} from '../../constants/options';
import { ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { RequestMentorModal } from '../../features/mentorship/components/RequestMentorModal';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../hooks/useAuth';
import { useDisclosure } from '../../hooks/useDisclosure';
import { mentorsService } from '../../services/mentors.service';

export const MentorDetailPage = () => {
	const { mentorId } = useParams();
	const { user, role } = useAuth();
	const requestModal = useDisclosure();
	const [hasPendingRequest, setHasPendingRequest] = useState(false);

	const {
		data: mentor,
		error,
		isLoading,
		refetch,
	} = useAsync(() => mentorsService.getById(mentorId), [mentorId]);

	useEffect(() => {
		let isActive = true;
		if (!user?.id) return undefined;

		mentorsService.listForMember(user.id).then((requests) => {
			if (!isActive) return;
			setHasPendingRequest(
				requests.some(
					(row) => row.mentorId === mentorId && row.status === REQUEST_STATUS.PENDING,
				),
			);
		});

		return () => {
			isActive = false;
		};
	}, [mentorId, user?.id]);

	if (isLoading) return <SkeletonCard />;
	if (error) return <ErrorState message={error} onRetry={refetch} />;
	if (!mentor) return null;

	const canRequest = role === ROLES.MEMBER;

	return (
		<div>
			<PageHeader backTo={ROUTES.mentors} backLabel="Back to mentors" title={mentor.name}>
				<div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
					<Avatar name={mentor.name} size="2xl" />

					<div className="min-w-0 flex-1">
						<p className="text-base font-semibold text-ink-900">{mentor.title}</p>
						<p className="mt-0.5 text-sm text-ink-500">{mentor.company}</p>

						<div className="mt-4 flex flex-wrap gap-2">
							<Badge
								tone={mentor.availability === 'open' ? 'success' : 'warning'}
								size="lg"
								dot
							>
								{mentor.availability === 'open'
									? 'Open to new mentees'
									: 'Limited availability'}
							</Badge>
							<Badge tone="outline" size="lg" icon="star">
								{mentor.rating} · {mentor.sessionsCompleted} sessions
							</Badge>
							<Badge tone="outline" size="lg" icon="clock">
								{mentor.responseTime}
							</Badge>
						</div>
					</div>

					{canRequest && (
						<Button
							size="lg"
							onClick={requestModal.open}
							disabled={hasPendingRequest}
							leadingIcon={hasPendingRequest ? 'check' : undefined}
							trailingIcon={hasPendingRequest ? undefined : 'arrow-right'}
						>
							{hasPendingRequest ? 'Request pending' : 'Request mentorship'}
						</Button>
					)}
				</div>
			</PageHeader>

			<div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
				<div className="space-y-8">
					<section>
						<h2 className="font-display text-lg font-semibold tracking-tight text-ink-900">
							In their words
						</h2>
						<p className="mt-3 text-sm leading-relaxed text-ink-600">{mentor.bio}</p>
					</section>

					<section>
						<h2 className="font-display text-lg font-semibold tracking-tight text-ink-900">
							Track record
						</h2>
						<ul className="mt-3 space-y-2.5">
							{mentor.highlights.map((item) => (
								<li
									key={item}
									className="flex gap-3 text-sm leading-relaxed text-ink-600"
								>
									<Icon
										name="check"
										size="sm"
										className="mt-0.5 shrink-0 text-brand-600"
									/>
									{item}
								</li>
							))}
						</ul>
					</section>

					<section>
						<h2 className="font-display text-lg font-semibold tracking-tight text-ink-900">
							Can help you with
						</h2>
						<div className="mt-3 flex flex-wrap gap-2">
							{mentor.focusAreas.map((area) => (
								<Badge key={area} tone="brand" size="lg">
									{labelFor(MENTORSHIP_GOALS, area)}
								</Badge>
							))}
						</div>
					</section>

					<section>
						<h2 className="font-display text-lg font-semibold tracking-tight text-ink-900">
							Expertise
						</h2>
						<div className="mt-3 flex flex-wrap gap-2">
							{mentor.skills.map((skill) => (
								<Badge key={skill} tone="outline" size="lg">
									{skill}
								</Badge>
							))}
						</div>
					</section>
				</div>

				<aside className="lg:sticky lg:top-24 lg:self-start">
					<Card>
						<h2 className="font-display text-base font-semibold tracking-tight text-ink-900">
							At a glance
						</h2>

						<dl className="mt-4 space-y-3.5 border-t border-line pt-4 text-[13px]">
							{[
								['Specialisation', labelFor(CAREER_TRACKS, mentor.track)],
								['Seniority', labelFor(EXPERIENCE_LEVELS, mentor.level)],
								['Experience', `${mentor.yearsExperience} years`],
								['Based in', labelFor(LOCATIONS, mentor.location)],
								['Languages', mentor.languages.join(', ')],
								['Mentee capacity', `${mentor.capacity} at a time`],
							].map(([label, value]) => (
								<div key={label} className="flex justify-between gap-4">
									<dt className="text-ink-400">{label}</dt>
									<dd className="text-right font-semibold text-ink-900">{value}</dd>
								</div>
							))}
						</dl>

						{canRequest && !hasPendingRequest && (
							<Button fullWidth className="mt-5" onClick={requestModal.open}>
								Request mentorship
							</Button>
						)}
					</Card>
				</aside>
			</div>

			{canRequest && (
				<RequestMentorModal
					mentor={mentor}
					isOpen={requestModal.isOpen}
					onClose={requestModal.close}
					onRequested={() => setHasPendingRequest(true)}
				/>
			)}
		</div>
	);
};
