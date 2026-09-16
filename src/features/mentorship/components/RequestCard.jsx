import { Icon } from '../../../components/icons/Icon';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import {
	MENTORSHIP_GOALS,
	REQUEST_STATUS,
	REQUEST_STATUS_META,
	labelFor,
} from '../../../constants/options';
import { formatRelativeTime } from '../../../lib/format';

/**
 * One mentorship request.
 *
 * `perspective` flips the card between the member's view (their outgoing
 * request) and the mentor's view (an incoming request they can action).
 */
export const RequestCard = ({
	request,
	perspective = 'member',
	onRespond,
	onCancel,
	isBusy = false,
}) => {
	const status = REQUEST_STATUS_META[request.status] ?? {
		label: request.status,
		tone: 'neutral',
	};

	const isMentorView = perspective === 'mentor';
	const counterpartName = isMentorView ? request.userName : request.mentorName;

	return (
		<Card>
			<div className="flex items-start gap-4">
				<Avatar name={counterpartName} size="md" />

				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-2.5">
						<h3 className="font-display text-base font-semibold tracking-tight text-ink-900">
							{counterpartName}
						</h3>
						<Badge tone={status.tone} size="sm" dot>
							{status.label}
						</Badge>
					</div>

					{!isMentorView && (
						<p className="mt-0.5 text-[13px] text-ink-500">
							{request.mentorTitle} · {request.mentorCompany}
						</p>
					)}

					<div className="mt-3 flex flex-wrap gap-1.5">
						<Badge tone="brand" size="sm" icon="compass">
							{labelFor(MENTORSHIP_GOALS, request.goal)}
						</Badge>
						<Badge tone="outline" size="sm">
							{request.preferredFormat}
						</Badge>
					</div>

					<p className="mt-3 rounded-field bg-surface-muted px-3.5 py-3 text-[13px] leading-relaxed text-ink-600">
						{request.message}
					</p>

					{request.responseNote && (
						<p className="mt-3 border-l-2 border-brand-300 pl-3.5 text-[13px] leading-relaxed text-ink-600">
							<span className="font-semibold text-ink-800">Reply: </span>
							{request.responseNote}
						</p>
					)}

					<p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-400">
						<Icon name="clock" size="xs" />
						Sent {formatRelativeTime(request.createdAt)}
					</p>
				</div>
			</div>

			{(isMentorView || onCancel) && request.status === REQUEST_STATUS.PENDING && (
				<div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
					{isMentorView ? (
						<>
							<Button
								size="sm"
								leadingIcon="check"
								isLoading={isBusy}
								onClick={() => onRespond?.(request, REQUEST_STATUS.ACCEPTED)}
							>
								Accept request
							</Button>
							<Button
								size="sm"
								variant="ghost"
								disabled={isBusy}
								onClick={() => onRespond?.(request, REQUEST_STATUS.DECLINED)}
								className="text-danger-500 hover:bg-danger-50"
							>
								Decline
							</Button>
						</>
					) : (
						<Button
							size="sm"
							variant="ghost"
							isLoading={isBusy}
							onClick={() => onCancel?.(request)}
							className="text-danger-500 hover:bg-danger-50"
						>
							Cancel request
						</Button>
					)}
				</div>
			)}
		</Card>
	);
};
