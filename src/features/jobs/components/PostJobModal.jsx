import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { TagInput } from '../../../components/ui/TagInput';
import { Textarea } from '../../../components/ui/Textarea';
import {
	CAREER_TRACKS,
	EMPLOYMENT_TYPES,
	EXPERIENCE_LEVELS,
	LOCATIONS,
	SKILL_SUGGESTIONS,
	WORK_MODES,
} from '../../../constants/options';
import { useAuth } from '../../../hooks/useAuth';
import { useForm } from '../../../hooks/useForm';
import { useToast } from '../../../hooks/useToast';
import { rules } from '../../../lib/validators';
import { jobsService } from '../../../services/jobs.service';

/** Splits a textarea of one-per-line entries into a clean array. */
const toLines = (value = '') =>
	value
		.split('\n')
		.map((line) => line.replace(/^[-•\s]+/, '').trim())
		.filter(Boolean);

/** Job posting composer for employer partners. */
export const PostJobModal = ({ isOpen, onClose, onCreated }) => {
	const { user } = useAuth();
	const toast = useToast();

	const form = useForm({
		initialValues: {
			title: '',
			track: '',
			level: '',
			location: '',
			workMode: '',
			employmentType: 'full-time',
			salaryMin: '',
			salaryMax: '',
			closingAt: '',
			summary: '',
			responsibilities: '',
			requirements: '',
			skills: [],
			womenFriendly: [],
		},
		validationSchema: {
			title: [rules.required('Give the role a title')],
			track: [rules.required('Pick a specialisation')],
			level: [rules.required('Pick an experience level')],
			location: [rules.required('Where is this role based?')],
			workMode: [rules.required('Select a work mode')],
			employmentType: [rules.required('Select a contract type')],
			closingAt: [rules.required('Set a closing date')],
			summary: [
				rules.required('Write a short summary'),
				rules.minLength(60, 'At least 60 characters'),
			],
			responsibilities: [rules.required('List what this person will own')],
			requirements: [rules.required('List what you are looking for')],
			skills: [rules.minItems(1, 'Add at least one skill')],
		},
		onSubmit: async (values) => {
			const created = await jobsService.createPosting({
				userId: user.id,
				company: user.profile?.companyName || user.name,
				companyId: user.profile?.companyId,
				title: values.title,
				track: values.track,
				level: values.level,
				location: values.location,
				workMode: values.workMode,
				employmentType: values.employmentType,
				closingAt: new Date(values.closingAt).toISOString(),
				summary: values.summary,
				responsibilities: toLines(values.responsibilities),
				requirements: toLines(values.requirements),
				skills: values.skills,
				womenFriendly: values.womenFriendly,
				salary: {
					min: values.salaryMin ? Number(values.salaryMin) : null,
					max: values.salaryMax ? Number(values.salaryMax) : null,
				},
			});

			toast.success(`"${created.title}" is live on the job board.`, 'Role posted');
			onCreated?.(created);
			onClose?.();
			form.reset();
		},
	});

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Post a role"
			description="Roles that state a salary band and work mode get about twice the applications."
			size="xl"
			footer={
				<>
					<Button variant="ghost" onClick={onClose} disabled={form.isSubmitting}>
						Cancel
					</Button>
					<Button
						onClick={form.handleSubmit}
						isLoading={form.isSubmitting}
						loadingText="Publishing"
					>
						Publish role
					</Button>
				</>
			}
		>
			<form onSubmit={form.handleSubmit} className="space-y-5" noValidate>
				{form.submitError && <Alert tone="danger">{form.submitError}</Alert>}

				<Input
					label="Role title"
					required
					placeholder="Senior Frontend Engineer"
					{...form.getFieldProps('title')}
				/>

				<div className="grid gap-5 sm:grid-cols-2">
					<Select
						label="Specialisation"
						required
						options={CAREER_TRACKS}
						placeholder="Choose a track"
						{...form.getFieldProps('track')}
					/>
					<Select
						label="Experience level"
						required
						options={EXPERIENCE_LEVELS}
						placeholder="Choose a level"
						{...form.getFieldProps('level')}
					/>
					<Select
						label="Location"
						required
						options={LOCATIONS}
						placeholder="Choose a location"
						{...form.getFieldProps('location')}
					/>
					<Select
						label="Work mode"
						required
						options={WORK_MODES}
						placeholder="Choose a work mode"
						{...form.getFieldProps('workMode')}
					/>
					<Select
						label="Contract type"
						required
						options={EMPLOYMENT_TYPES}
						allowEmpty={false}
						{...form.getFieldProps('employmentType')}
					/>
					<Input
						label="Applications close"
						type="date"
						required
						{...form.getFieldProps('closingAt')}
					/>
					<Input
						label="Salary from"
						optional
						inputMode="numeric"
						trailingAddon="LKR"
						placeholder="350000"
						{...form.getFieldProps('salaryMin')}
					/>
					<Input
						label="Salary to"
						optional
						inputMode="numeric"
						trailingAddon="LKR"
						placeholder="480000"
						{...form.getFieldProps('salaryMax')}
					/>
				</div>

				<Textarea
					label="Summary"
					required
					rows={3}
					maxLength={400}
					showCount
					placeholder="Two sentences on the work and why it matters."
					{...form.getFieldProps('summary')}
				/>

				<Textarea
					label="What this person will own"
					required
					rows={4}
					placeholder={'One per line\nLead frontend delivery for two squads'}
					hint="One responsibility per line."
					{...form.getFieldProps('responsibilities')}
				/>

				<Textarea
					label="What you are looking for"
					required
					rows={4}
					placeholder={'One per line\n6+ years building production web applications'}
					hint="One requirement per line."
					{...form.getFieldProps('requirements')}
				/>

				<TagInput
					label="Skills"
					required
					value={form.values.skills}
					onChange={(next) => form.setFieldValue('skills', next)}
					suggestions={SKILL_SUGGESTIONS}
					error={form.touched.skills ? form.errors.skills : undefined}
					max={8}
				/>

				<TagInput
					label="Policies you want to lead with"
					optional
					value={form.values.womenFriendly}
					onChange={(next) => form.setFieldValue('womenFriendly', next)}
					suggestions={[
						'Flexible hours',
						'Hybrid by default',
						'Fully remote',
						'Parental leave 6 months',
						'Return-to-work programme',
						'Sponsored certifications',
						'Leadership coaching budget',
						'Transport after 7pm',
					]}
					placeholder="Add a policy and press Enter"
					hint="Candidates filter on these. Only list what you actually do."
					max={5}
				/>
			</form>
		</Modal>
	);
};
