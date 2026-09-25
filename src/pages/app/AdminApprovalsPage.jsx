import { useCallback, useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Icon } from '../../components/icons/Icon';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { SkeletonList } from '../../components/ui/Skeleton';
import { Tabs } from '../../components/ui/Tabs';
import {
	APPROVAL_STATUS,
	APPROVAL_STATUS_META,
	DECLINE_REASONS,
} from '../../constants/options';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../hooks/useAuth';
import { useDisclosure } from '../../hooks/useDisclosure';
import { useToast } from '../../hooks/useToast';
import { formatDateTime, formatRelativeTime } from '../../lib/format';
import { approvalService } from '../../services/approval.service';

const REASON_OPTIONS = DECLINE_REASONS.map(({ value, label }) => ({ value, label }));

/** One account awaiting (or having had) a decision. */
const ReviewRow = ({ record, onApprove, onDecline, onInspect, isBusy }) => {
	const status = APPROVAL_STATUS_META[record.approvalStatus] ?? { label: '—', tone: 'neutral' };
	const isPending = record.approvalStatus === APPROVAL_STATUS.PENDING;

	return (
		<Card className="sm:flex sm:items-start sm:gap-5">
			<button
				type="button"
				onClick={() => onInspect(record)}
				className="group relative block w-full shrink-0 overflow-hidden rounded-card border border-line sm:w-40"
				aria-label={`View ${record.name}'s verification photo full size`}
			>
				{record.photoDataUrl ? (
					<img
						src={record.photoDataUrl}
						alt={`Verification capture for ${record.name}`}
						className="aspect-[4/3] w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
					/>
				) : (
					<div className="flex aspect-[4/3] w-full items-center justify-center bg-ink-100 text-ink-400">
						<Icon name="user" size="lg" />
					</div>
				)}

				<span className="absolute bottom-1.5 right-1.5 rounded-md bg-ink-950/70 px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
					Enlarge
				</span>
			</button>

			<div className="mt-4 min-w-0 flex-1 sm:mt-0">
				<div className="flex flex-wrap items-center gap-2.5">
					<h3 className="font-display text-base font-semibold tracking-tight text-ink-900">
						{record.name}
					</h3>
					<Badge tone={status.tone} size="sm" dot>
						{status.label}
					</Badge>
					{record.resubmittedAt && (
						<Badge tone="info" size="sm">
							Resubmitted
						</Badge>
					)}
				</div>

				<p className="mt-0.5 truncate text-[13px] text-ink-500">{record.email}</p>

				<dl className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-ink-400">
					<div className="inline-flex items-center gap-1.5">
						<Icon name="calendar" size="xs" />
						<dt className="sr-only">Signed up</dt>
						<dd>{formatDateTime(record.signupAt)}</dd>
					</div>
					<div className="inline-flex items-center gap-1.5">
						<Icon name="clock" size="xs" />
						<dt className="sr-only">Waiting</dt>
						<dd>{formatRelativeTime(record.resubmittedAt ?? record.signupAt)}</dd>
					</div>
					{record.decisionAt && (
						<div className="inline-flex items-center gap-1.5">
							<Icon name="check-circle" size="xs" />
							<dt className="sr-only">Decided</dt>
							<dd>Decided {formatRelativeTime(record.decisionAt)}</dd>
						</div>
					)}
				</dl>

				{record.declineReason && (
					<p className="mt-3 border-l-2 border-danger-500/40 pl-3 text-[13px] leading-relaxed text-ink-600">
						<span className="font-semibold text-ink-800">
							{record.declineReason.label}:{' '}
						</span>
						{record.declineReason.message}
					</p>
				)}

				<div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
					{isPending ? (
						<>
							<Button
								size="sm"
								leadingIcon="check"
								isLoading={isBusy}
								onClick={() => onApprove(record)}
							>
								Approve
							</Button>
							<Button
								size="sm"
								variant="ghost"
								disabled={isBusy}
								onClick={() => onDecline(record)}
								className="text-danger-500 hover:bg-danger-50"
							>
								Decline
							</Button>
						</>
					) : record.approvalStatus === APPROVAL_STATUS.DECLINED ? (
						<Button
							size="sm"
							variant="secondary"
							leadingIcon="check"
							isLoading={isBusy}
							onClick={() => onApprove(record)}
						>
							Approve after all
						</Button>
					) : (
						<p className="text-xs text-ink-400">
							Approved {formatRelativeTime(record.decisionAt)}
						</p>
					)}
				</div>
			</div>
		</Card>
	);
};

/**
 * Admin queue for woman-in-tech signups.
 *
 * Writes go through `approvalService`, which updates localStorage. That write
 * is what fires the `storage` event in the waiting member's tab and moves them
 * off the holding screen — no action needed here beyond approving.
 */
export const AdminApprovalsPage = () => {
	const { user } = useAuth();
	const toast = useToast();
	const declineModal = useDisclosure();

	const [tab, setTab] = useState('pending');
	const [busyId, setBusyId] = useState(null);
	const [target, setTarget] = useState(null);
	const [reason, setReason] = useState(DECLINE_REASONS[0].value);
	const [preview, setPreview] = useState(null);

	const load = useCallback(
		() =>
			Promise.all([approvalService.listPending(), approvalService.listDecided()]).then(
				([pending, decided]) => ({ pending, decided }),
			),
		[],
	);

	const { data, error, isLoading, refetch } = useAsync(load, []);

	const handleApprove = async (record) => {
		setBusyId(record.id);
		try {
			await approvalService.approve(record.id, user.id);
			toast.success(`${record.name} can now use Aruna.`, 'Approved');
			await refetch();
		} catch {
			toast.error('We could not update that account.');
		} finally {
			setBusyId(null);
		}
	};

	const openDecline = (record) => {
		setTarget(record);
		setReason(DECLINE_REASONS[0].value);
		declineModal.open();
	};

	const confirmDecline = async () => {
		if (!target) return;

		setBusyId(target.id);
		try {
			await approvalService.decline(target.id, user.id, reason);
			toast.info(`${target.name} has been declined and told why.`);
			declineModal.close();
			setTarget(null);
			await refetch();
		} catch {
			toast.error('We could not update that account.');
		} finally {
			setBusyId(null);
		}
	};

	const pending = data?.pending ?? [];
	const decided = data?.decided ?? [];
	const visible = tab === 'pending' ? pending : decided;

	return (
		<div>
			<PageHeader
				eyebrow="Trust & safety"
				title="Pending approvals"
				description="Aruna is a women-only community. Every member account is checked against its live photo capture before it opens."
				actions={
					<Button variant="secondary" size="md" leadingIcon="spark" onClick={refetch}>
						Refresh
					</Button>
				}
			/>

			<Tabs
				ariaLabel="Approval queue"
				value={tab}
				onChange={setTab}
				items={[
					{ value: 'pending', label: 'Awaiting review', count: pending.length },
					{ value: 'decided', label: 'Decided', count: decided.length },
				]}
				className="mb-6"
			/>

			{isLoading ? (
				<SkeletonList count={2} />
			) : error ? (
				<ErrorState message={error} onRetry={refetch} />
			) : visible.length > 0 ? (
				<div className="space-y-4">
					{visible.map((record) => (
						<ReviewRow
							key={record.id}
							record={record}
							isBusy={busyId === record.id}
							onApprove={handleApprove}
							onDecline={openDecline}
							onInspect={setPreview}
						/>
					))}
				</div>
			) : (
				<EmptyState
					icon={tab === 'pending' ? 'check-circle' : 'clipboard'}
					tone={tab === 'pending' ? 'brand' : 'neutral'}
					title={tab === 'pending' ? 'Nothing waiting for review' : 'No decisions yet'}
					description={
						tab === 'pending'
							? 'New member signups land here the moment someone submits their photo.'
							: 'Accounts you approve or decline are kept here so the record is auditable.'
					}
				/>
			)}

			<Modal
				isOpen={declineModal.isOpen}
				onClose={declineModal.close}
				title={`Decline ${target?.name ?? 'this account'}?`}
				description="They will see the reason you pick and, unless it is an eligibility decision, can retake their photo."
				size="md"
				footer={
					<>
						<Button variant="ghost" onClick={declineModal.close} disabled={Boolean(busyId)}>
							Cancel
						</Button>
						<Button
							variant="danger"
							onClick={confirmDecline}
							isLoading={Boolean(busyId)}
							loadingText="Declining"
						>
							Decline account
						</Button>
					</>
				}
			>
				<Select
					label="Reason"
					options={REASON_OPTIONS}
					allowEmpty={false}
					value={reason}
					onChange={(event) => setReason(event.target.value)}
				/>

				<p className="mt-4 rounded-field bg-surface-muted px-3.5 py-3 text-[13px] leading-relaxed text-ink-600">
					<span className="font-semibold text-ink-800">They will see: </span>
					{DECLINE_REASONS.find((item) => item.value === reason)?.message}
				</p>
			</Modal>

			<Modal
				isOpen={Boolean(preview)}
				onClose={() => setPreview(null)}
				title={preview?.name ?? 'Verification photo'}
				description={preview?.email}
				size="lg"
			>
				{preview?.photoDataUrl ? (
					<img
						src={preview.photoDataUrl}
						alt={`Verification capture for ${preview.name}`}
						className="w-full rounded-card border border-line"
					/>
				) : (
					<p className="text-sm text-ink-500">No photo was captured for this account.</p>
				)}
			</Modal>
		</div>
	);
};
