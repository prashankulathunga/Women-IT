import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { MENTORSHIP_GOALS } from '../../../constants/options';
import { useAuth } from '../../../hooks/useAuth';
import { useForm } from '../../../hooks/useForm';
import { useToast } from '../../../hooks/useToast';
import { rules } from '../../../lib/validators';
import { mentorsService } from '../../../services/mentors.service';

const FORMAT_OPTIONS = [
	{ value: 'video', label: 'Video call' },
	{ value: 'in-person', label: 'In person (Colombo)' },
	{ value: 'async', label: 'Written / async' },
];

/** Mentorship request form, scoped to a single mentor. */
export const RequestMentorModal = ({ mentor, isOpen, onClose, onRequested }) => {
	const { user } = useAuth();
	const toast = useToast();

	// Only offer goals this mentor actually covers.
	const goalOptions = MENTORSHIP_GOALS.filter((goal) =>
		mentor?.focusAreas?.includes(goal.value),
	);

	const form = useForm({
		initialValues: { goal: '', message: '', preferredFormat: 'video' },
		validationSchema: {
			goal: [rules.required('Pick what you want help with')],
			message: [
				rules.required('Give your mentor some context'),
				rules.minLength(60, 'A little more context helps — at least 60 characters'),
				rules.maxLength(900),
			],
			preferredFormat: [rules.required('Choose a format')],
		},
		onSubmit: async (values) => {
			const created = await mentorsService.createRequest({
				mentorId: mentor.id,
				userId: user.id,
				userName: user.name,
				goal: values.goal,
				message: values.message,
				preferredFormat: values.preferredFormat,
			});

			toast.success(
				`${mentor.name} has your request. ${mentor.responseTime.toLowerCase()}.`,
				'Request sent',
			);
			onRequested?.(created);
			onClose?.();
			form.reset();
		},
	});

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`Request mentorship — ${mentor?.name ?? ''}`}
			description={mentor ? `${mentor.title} · ${mentor.company}` : undefined}
			size="lg"
			footer={
				<>
					<Button variant="ghost" onClick={onClose} disabled={form.isSubmitting}>
						Cancel
					</Button>
					<Button
						onClick={form.handleSubmit}
						isLoading={form.isSubmitting}
						loadingText="Sending"
						trailingIcon="arrow-right"
					>
						Send request
					</Button>
				</>
			}
		>
			<form onSubmit={form.handleSubmit} className="space-y-5">
				{form.submitError && <Alert tone="danger">{form.submitError}</Alert>}

				<Alert tone="info" title="Before you send">
					Mentors here volunteer their time. A specific ask gets a yes far more often
					than an open-ended one.
				</Alert>

				<Select
					label="What do you want help with?"
					required
					options={goalOptions}
					placeholder="Choose a focus area"
					{...form.getFieldProps('goal')}
				/>

				<Textarea
					label="Your message"
					required
					rows={6}
					maxLength={900}
					showCount
					placeholder="Where you are now, what you are trying to move towards, and the specific thing you are stuck on."
					hint="Two or three sentences is plenty."
					{...form.getFieldProps('message')}
				/>

				<Select
					label="Preferred format"
					required
					options={FORMAT_OPTIONS}
					allowEmpty={false}
					{...form.getFieldProps('preferredFormat')}
				/>
			</form>
		</Modal>
	);
};
