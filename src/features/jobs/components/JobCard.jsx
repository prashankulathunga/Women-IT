import { Link } from 'react-router-dom';
import { Icon } from '../../../components/icons/Icon';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import {
	EMPLOYMENT_TYPES,
	EXPERIENCE_LEVELS,
	LOCATIONS,
	WORK_MODES,
	labelFor,
} from '../../../constants/options';
import { ROUTES } from '../../../constants/routes';
import {
	formatRelativeTime,
	formatSalaryRange,
	isClosingSoon,
	truncate,
} from '../../../lib/format';

/** Job summary card used on the board, the dashboard and the landing page. */
export const JobCard = ({ job, compact = false }) => {
	const closingSoon = isClosingSoon(job.closingAt);

	return (
		<Card interactive padding={compact ? 'sm' : 'md'} className="group relative">
			<div className="flex items-start gap-4">
				<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 font-display text-base font-semibold text-brand-900">
					{job.company.charAt(0)}
				</span>

				<div className="min-w-0 flex-1">
					<div className="flex items-start justify-between gap-3">
						<div className="min-w-0">
							<h3 className="truncate font-display text-base font-semibold tracking-tight text-ink-900">
								<Link
									to={ROUTES.jobDetail(job.id)}
									className="outline-none after:absolute after:inset-0 after:content-[''] hover:text-brand-900"
								>
									{job.title}
								</Link>
							</h3>
							<p className="mt-0.5 truncate text-[13px] text-ink-500">{job.company}</p>
						</div>

						{closingSoon && (
							<Badge tone="warning" size="sm">
								Closing soon
							</Badge>
						)}
					</div>

					<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-500">
						<span className="inline-flex items-center gap-1.5">
							<Icon name="map-pin" size="xs" className="text-ink-400" />
							{labelFor(LOCATIONS, job.location)} ·{' '}
							{labelFor(WORK_MODES, job.workMode)}
						</span>
						<span className="inline-flex items-center gap-1.5">
							<Icon name="briefcase" size="xs" className="text-ink-400" />
							{labelFor(EMPLOYMENT_TYPES, job.employmentType)}
						</span>
						<span className="inline-flex items-center gap-1.5">
							<Icon name="trending-up" size="xs" className="text-ink-400" />
							{labelFor(EXPERIENCE_LEVELS, job.level)}
						</span>
					</div>

					{!compact && (
						<p className="mt-3 text-[13px] leading-relaxed text-ink-600">
							{truncate(job.summary, 150)}
						</p>
					)}

					{!compact && job.womenFriendly?.length > 0 && (
						<div className="mt-4 flex flex-wrap gap-1.5">
							{job.womenFriendly.slice(0, 3).map((perk) => (
								<Badge key={perk} tone="accent" size="sm" icon="heart">
									{perk}
								</Badge>
							))}
						</div>
					)}
				</div>
			</div>

			<div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
				<p className="text-[13px] font-semibold text-ink-900">
					{formatSalaryRange(job.salary)}
				</p>

				<div className="flex items-center gap-3 text-xs text-ink-400">
					<span>{formatRelativeTime(job.postedAt)}</span>
					{job.applicants !== undefined && (
						<>
							<span aria-hidden="true">·</span>
							<span>{job.applicants} applicants</span>
						</>
					)}
				</div>
			</div>
		</Card>
	);
};
