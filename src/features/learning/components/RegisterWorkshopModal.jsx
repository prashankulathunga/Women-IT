import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';
import { useAuth } from '../../../hooks/useAuth';
import { useForm } from '../../../hooks/useForm';
import { useToast } from '../../../hooks/useToast';
import { formatDateTime } from '../../../lib/format';
import { rules } from '../../../lib/validators';
import { learningService } from '../../../services/learning.service';

/** Workshop registration form. */
export const RegisterWorkshopModal = ({ workshop, isOpen, onClose, onRegistered }) => {
	const { user } = useAuth();
	const toast = useToast();

	const form = useForm({
		initialValues: { motivation: '' },
		validationSchema: {
			motivation: [
				rules.required('Tell the facilitator what you want from the session'),
				rules.minLength(40, 'A sentence or two, at least 40 characters'),
				rules.maxLength(600),
			],
		},
		onSubmit: async (values) => {
			const record = await learningService.register({
				workshopId: workshop.id,
				userId: user.id,
				userName: user.name,
				email: user.email,
				motivation: values.motivation,
			});

			toast.success(
				`Your seat for "${workshop.title}" is confirmed.`,
				'Registered',
			);
			onRegistered?.(record);
			onClose?.();
			form.reset();
		},
	});

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={workshop?.title ?? 'Register'}
			description={
				workshop
					? `${formatDateTime(workshop.startsAt)} · ${workshop.facilitator}`
					: undefined
			}
			footer={
				<>
					<Button variant="ghost" onClick={onClose} disabled={form.isSubmitting}>
						Cancel
					</Button>
					<Button
						onClick={form.handleSubmit}
						isLoading={form.isSubmitting}
						loadingText="Reserving seat"
					>
						Confirm registration
					</Button>
				</>
			}
		>
			<form onSubmit={form.handleSubmit} className="space-y-5">
				{form.submitError && <Alert tone="danger">{form.submitError}</Alert>}

				{workshop?.outcomes?.length > 0 && (
					<div className="rounded-field bg-surface-muted p-4">
						<p className="text-[13px] font-semibold text-ink-800">
							What you will leave with
						</p>
						<ul className="mt-2 space-y-1.5">
							{workshop.outcomes.map((outcome) => (
								<li
									key={outcome}
									className="flex gap-2 text-[13px] leading-relaxed text-ink-600"
								>
									<span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-600" />
									{outcome}
								</li>
							))}
						</ul>
					</div>
				)}

				<Textarea
					label="What do you want to get out of this?"
					required
					rows={5}
					maxLength={600}
					showCount
					placeholder="The facilitator uses these to shape the breakout groups."
					{...form.getFieldProps('motivation')}
				/>

				<p className="text-xs leading-relaxed text-ink-400">
					A calendar invite goes to {user?.email}. You can cancel any time before the
					session from Workshops.
				</p>
			</form>
		</Modal>
	);
};
