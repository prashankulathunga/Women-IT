import { Link } from 'react-router-dom';
import { Icon } from '../../../components/icons/Icon';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { CAREER_TRACKS, MENTORSHIP_GOALS, labelFor } from '../../../constants/options';
import { ROUTES } from '../../../constants/routes';
import { truncate } from '../../../lib/format';

/** Mentor summary card for the directory and dashboard widgets. */
export const MentorCard = ({ mentor, compact = false }) => (
	<Card interactive padding={compact ? 'sm' : 'md'} className="relative flex flex-col">
		<div className="flex items-start gap-4">
			<Avatar name={mentor.name} size={compact ? 'md' : 'lg'} />

			<div className="min-w-0 flex-1">
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0">
						<h3 className="truncate font-display text-base font-semibold tracking-tight text-ink-900">
							<Link
								to={ROUTES.mentorDetail(mentor.id)}
								className="outline-none after:absolute after:inset-0 after:content-[''] hover:text-brand-900"
							>
								{mentor.name}
							</Link>
						</h3>
						<p className="mt-0.5 truncate text-[13px] text-ink-500">
							{mentor.title} · {mentor.company}
						</p>
					</div>

					<Badge
						tone={mentor.availability === 'open' ? 'success' : 'warning'}
						size="sm"
						dot
					>
						{mentor.availability === 'open' ? 'Open' : 'Limited'}
					</Badge>
				</div>

				<div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500">
					<span className="inline-flex items-center gap-1">
						<Icon name="star" size="xs" className="text-warning-500" />
						<span className="font-semibold text-ink-700">{mentor.rating}</span>
						<span className="text-ink-400">({mentor.sessionsCompleted})</span>
					</span>
					<span className="inline-flex items-center gap-1.5">
						<Icon name="trending-up" size="xs" className="text-ink-400" />
						{mentor.yearsExperience} yrs
					</span>
					<span className="inline-flex items-center gap-1.5">
						<Icon name="compass" size="xs" className="text-ink-400" />
						{labelFor(CAREER_TRACKS, mentor.track)}
					</span>
				</div>
			</div>
		</div>

		{!compact && (
			<p className="mt-4 flex-1 text-[13px] leading-relaxed text-ink-600">
				{truncate(mentor.bio, 165)}
			</p>
		)}

		<div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-4">
			{mentor.focusAreas.slice(0, compact ? 2 : 3).map((area) => (
				<Badge key={area} tone="brand" size="sm">
					{labelFor(MENTORSHIP_GOALS, area)}
				</Badge>
			))}
			{mentor.focusAreas.length > (compact ? 2 : 3) && (
				<Badge tone="outline" size="sm">
					+{mentor.focusAreas.length - (compact ? 2 : 3)}
				</Badge>
			)}
		</div>
	</Card>
);
