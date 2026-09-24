import { Link } from 'react-router-dom';
import { Icon } from '../../../components/icons/Icon';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { APPLICATION_STATUS_META } from '../../../constants/options';
import { ROUTES } from '../../../constants/routes';
import { formatDate, formatRelativeTime, truncate } from '../../../lib/format';

/** One row in "My applications". */
export const ApplicationCard = ({ application, onWithdraw, isWithdrawing = false }) => {
	const status = APPLICATION_STATUS_META[application.status] ?? {
		label: application.status,
		tone: 'neutral',
	};

	return (
		<Card className="sm:flex sm:items-start sm:justify-between sm:gap-6">
			<div className="min-w-0 flex-1">
				<div className="flex flex-wrap items-center gap-2.5">
					<h3 className="font-display text-base font-semibold tracking-tight text-ink-900">
						<Link
							to={ROUTES.jobDetail(application.jobId)}
							className="hover:text-brand-900 hover:underline"
						>
							{application.jobTitle}
						</Link>
					</h3>
					<Badge tone={status.tone} size="sm" dot>
						{status.label}
					</Badge>
				</div>

				<p className="mt-1 text-[13px] text-ink-500">{application.company}</p>

				{application.coverNote && (
					<p className="mt-3 text-[13px] leading-relaxed text-ink-600">
						{truncate(application.coverNote, 160)}
					</p>
				)}

				<div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-400">
					<span className="inline-flex items-center gap-1.5">
						<Icon name="clock" size="xs" />
						Applied {formatRelativeTime(application.appliedAt)}
					</span>
					<span className="inline-flex items-center gap-1.5">
						<Icon name="calendar" size="xs" />
						{formatDate(application.appliedAt)}
					</span>
				</div>
			</div>

			<div className="mt-4 flex shrink-0 items-center gap-2 sm:mt-0">
				<Button
					to={ROUTES.jobDetail(application.jobId)}
					variant="secondary"
					size="sm"
				>
					View role
				</Button>

				{onWithdraw && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onWithdraw(application)}
						isLoading={isWithdrawing}
						className="text-danger-500 hover:bg-danger-50"
					>
						Withdraw
					</Button>
				)}
			</div>
		</Card>
	);
};
