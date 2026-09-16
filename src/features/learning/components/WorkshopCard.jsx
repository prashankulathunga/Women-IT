import { Icon } from '../../../components/icons/Icon';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Progress } from '../../../components/ui/Progress';
import { formatCurrency, formatDateTime } from '../../../lib/format';

const FORMAT_META = {
	online: { label: 'Online', tone: 'info' },
	hybrid: { label: 'Hybrid', tone: 'brand' },
	'in-person': { label: 'In person', tone: 'accent' },
};

/** Workshop card with live seat pressure and a register action. */
export const WorkshopCard = ({
	workshop,
	isRegistered = false,
	onRegister,
	isBusy = false,
}) => {
	const seatsLeft = workshop.seatsLeft ?? workshop.seats - workshop.seatsTaken;
	const isFull = workshop.isFull ?? seatsLeft <= 0;
	const format = FORMAT_META[workshop.format] ?? {
		label: workshop.format,
		tone: 'neutral',
	};

	return (
		<Card className="flex h-full flex-col">
			<div className="flex flex-wrap items-center gap-2">
				<Badge tone={format.tone} size="sm">
					{format.label}
				</Badge>
				<Badge tone="outline" size="sm">
					{workshop.price === 0 ? 'Free' : formatCurrency(workshop.price)}
				</Badge>
				{seatsLeft > 0 && seatsLeft <= 10 && (
					<Badge tone="warning" size="sm">
						{seatsLeft} seats left
					</Badge>
				)}
			</div>

			<h3 className="mt-3 font-display text-lg font-semibold leading-snug tracking-tight text-ink-900">
				{workshop.title}
			</h3>

			<p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink-600">
				{workshop.summary}
			</p>

			<dl className="mt-4 space-y-2 text-[13px] text-ink-600">
				<div className="flex items-center gap-2">
					<Icon name="calendar" size="xs" className="text-ink-400" />
					<dt className="sr-only">Starts</dt>
					<dd>{formatDateTime(workshop.startsAt)}</dd>
				</div>
				<div className="flex items-center gap-2">
					<Icon name="clock" size="xs" className="text-ink-400" />
					<dt className="sr-only">Duration</dt>
					<dd>{Math.round(workshop.durationMinutes / 60)} hours</dd>
				</div>
				<div className="flex items-center gap-2">
					<Icon name="user" size="xs" className="text-ink-400" />
					<dt className="sr-only">Facilitator</dt>
					<dd>
						{workshop.facilitator} · {workshop.host}
					</dd>
				</div>
			</dl>

			<div className="mt-5 border-t border-line pt-4">
				<Progress
					value={workshop.seatsTaken}
					max={workshop.seats}
					tone={isFull ? 'danger' : seatsLeft <= 10 ? 'warning' : 'brand'}
					label={`${workshop.seatsTaken} of ${workshop.seats} seats taken`}
					size="xs"
				/>

				<Button
					fullWidth
					className="mt-4"
					size="sm"
					variant={isRegistered ? 'secondary' : 'primary'}
					disabled={isRegistered || isFull}
					isLoading={isBusy}
					leadingIcon={isRegistered ? 'check' : undefined}
					onClick={() => onRegister?.(workshop)}
				>
					{isRegistered
						? 'You are registered'
						: isFull
							? 'Fully booked'
							: 'Register for this workshop'}
				</Button>
			</div>
		</Card>
	);
};
