import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { AVAILABILITY_OPTIONS } from '../../../constants/options';
import { useAuth } from '../../../hooks/useAuth';
import { useForm } from '../../../hooks/useForm';
import { useToast } from '../../../hooks/useToast';
import { rules } from '../../../lib/validators';
import { jobsService } from '../../../services/jobs.service';

/** Application form for a single job posting. */
export const ApplyJobModal = ({ job, isOpen, onClose, onApplied }) => {
	const { user } = useAuth();
	const toast = useToast();

	const form = useForm({
		initialValues: {
			coverNote: '',
			expectedSalary: '',
			availability: '',
		},
		validationSchema: {
			coverNote: [
				rules.required('Tell the hiring team why this role fits'),
				rules.minLength(80, 'Give them at least a short paragraph (80 characters)'),
				rules.maxLength(1200),
			],
			availability: [rules.required('Let them know when you could start')],
		},
		onSubmit: async (values) => {
			const application = await jobsService.apply({
				jobId: job.id,
				userId: user.id,
				userName: user.name,
				coverNote: values.coverNote,
				expectedSalary: values.expectedSalary,
				availability: values.availability,
			});

			toast.success(
				`Your application for ${job.title} is in.`,
				'Application submitted',
			);
			onApplied?.(application);
			onClose?.();
			form.reset();
		},
	});

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`Apply — ${job?.title ?? ''}`}
			description={`${job?.company ?? ''} · Your Aruna profile is shared with this application.`}
			size="lg"
			footer={
				<>
					<Button variant="ghost" onClick={onClose} disabled={form.isSubmitting}>
						Cancel
					</Button>
					<Button
						onClick={form.handleSubmit}
						isLoading={form.isSubmitting}
						loadingText="Submitting"
						trailingIcon="arrow-right"
					>
						Submit application
					</Button>
				</>
			}
		>
			<form onSubmit={form.handleSubmit} className="space-y-5">
				{form.submitError && <Alert tone="danger">{form.submitError}</Alert>}

				<Alert tone="brand" title="What the employer sees">
					Your name, headline, experience level, skills and this note. Contact details
					are only released once they move you forward.
				</Alert>

				<Textarea
					label="Why this role"
					required
					rows={6}
					maxLength={1200}
					showCount
					placeholder="What you have done that maps onto this role, and what you are looking for next."
					hint="Specific beats enthusiastic. Name the work, not the adjectives."
					{...form.getFieldProps('coverNote')}
				/>

				<div className="grid gap-4 sm:grid-cols-2">
					<Select
						label="Earliest start"
						required
						options={AVAILABILITY_OPTIONS}
						placeholder="Select availability"
						{...form.getFieldProps('availability')}
					/>

					<Input
						label="Expected monthly salary"
						optional
						inputMode="numeric"
						placeholder="e.g. 420000"
						trailingAddon="LKR"
						hint="Leave blank to discuss later."
						{...form.getFieldProps('expectedSalary')}
					/>
				</div>
			</form>
		</Modal>
	);
};
