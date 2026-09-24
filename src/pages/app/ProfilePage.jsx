import { useMemo, useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SchemaField } from '../../components/common/SchemaField';
import { Icon } from '../../components/icons/Icon';
import { Alert } from '../../components/ui/Alert';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Progress } from '../../components/ui/Progress';
import {
	AVAILABILITY_OPTIONS,
	CAREER_TRACKS,
	COMPANY_SIZES,
	EXPERIENCE_LEVELS,
	LOCATIONS,
	MENTORSHIP_GOALS,
	labelFor,
} from '../../constants/options';
import { ROLES, ROLE_META } from '../../constants/roles';
import {
	initialValuesFromProfile,
	schemaFromFields,
	stepsForRole,
} from '../../features/profile/profileFields';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../hooks/useToast';
import { cn } from '../../lib/cn';
import { rules } from '../../lib/validators';

/** Read-only summary row. */
const Fact = ({ label, value }) => (
	<div className="flex items-baseline justify-between gap-4 py-2.5">
		<dt className="text-[13px] text-ink-400">{label}</dt>
		<dd className="text-right text-[13px] font-semibold text-ink-900">{value || '—'}</dd>
	</div>
);

export const ProfilePage = () => {
	const { user, role, completion, updateProfile } = useAuth();
	const toast = useToast();
	const [isEditing, setIsEditing] = useState(completion < 100);

	const steps = useMemo(() => stepsForRole(role), [role]);
	const allFields = useMemo(() => steps.flatMap((step) => step.fields), [steps]);

	const initialValues = useMemo(
		() => ({ name: user.name, ...initialValuesFromProfile(role, user.profile) }),
		[role, user.name, user.profile],
	);

	const validationSchema = useMemo(
		() => ({
			name: [rules.required('Enter your full name'), rules.minLength(2)],
			...schemaFromFields(allFields),
		}),
		[allFields],
	);

	const form = useForm({
		initialValues,
		validationSchema,
		onSubmit: async (values) => {
			await updateProfile(values);
			toast.success('Your profile has been updated.');
			setIsEditing(false);
		},
	});

	const profile = user.profile ?? {};
	const isCompany = role === ROLES.COMPANY;

	const displayName = isCompany ? profile.companyName || user.name : user.name;

	return (
		<div>
			<PageHeader
				eyebrow="Account"
				title="My profile"
				description={
					isCompany
						? 'This is what candidates see on every role you post.'
						: 'This is what employers and mentors see when you apply or reach out.'
				}
				actions={
					isEditing ? (
						<>
							<Button
								variant="ghost"
								onClick={() => {
									form.reset(initialValues);
									setIsEditing(false);
								}}
								disabled={form.isSubmitting}
							>
								Cancel
							</Button>
							<Button
								onClick={form.handleSubmit}
								isLoading={form.isSubmitting}
								loadingText="Saving"
								leadingIcon="check"
							>
								Save changes
							</Button>
						</>
					) : (
						<Button variant="secondary" leadingIcon="settings" onClick={() => setIsEditing(true)}>
							Edit profile
						</Button>
					)
				}
			/>

			{completion < 100 && (
				<Alert tone="brand" title={`Your profile is ${completion}% complete`} className="mb-6">
					Profiles above 80% get roughly three times more responses from employers and
					mentors.
				</Alert>
			)}

			<div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
				<aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
					<Card className="text-center">
						<Avatar
							name={displayName}
							src={profile.avatarUrl}
							size="2xl"
							className="mx-auto"
						/>

						<h2 className="mt-4 font-display text-lg font-semibold tracking-tight text-ink-900">
							{displayName}
						</h2>
						<p className="mt-1 text-[13px] text-ink-500">
							{profile.headline || ROLE_META[role]?.tagline}
						</p>

						<Badge tone="brand" size="md" className="mt-3">
							{ROLE_META[role]?.label}
						</Badge>

						<Progress
							value={completion}
							tone={completion >= 80 ? 'success' : 'brand'}
							label="Profile strength"
							showValue
							className="mt-6 text-left"
						/>
					</Card>

					<Card>
						<h3 className="font-display text-base font-semibold tracking-tight text-ink-900">
							At a glance
						</h3>

						<dl className="mt-2 divide-y divide-line">
							{isCompany ? (
								<>
									<Fact label="Industry" value={profile.industry} />
									<Fact
										label="Size"
										value={labelFor(COMPANY_SIZES, profile.companySize, '')}
									/>
									<Fact
										label="Head office"
										value={labelFor(LOCATIONS, profile.location, '')}
									/>
									<Fact label="Your role" value={profile.title} />
								</>
							) : (
								<>
									<Fact label="Current role" value={profile.title} />
									<Fact label="Employer" value={profile.company} />
									<Fact
										label="Specialisation"
										value={labelFor(CAREER_TRACKS, profile.track, '')}
									/>
									<Fact
										label="Level"
										value={labelFor(EXPERIENCE_LEVELS, profile.level, '')}
									/>
									<Fact
										label="Experience"
										value={profile.yearsExperience ? `${profile.yearsExperience} years` : ''}
									/>
									<Fact
										label="Based in"
										value={labelFor(LOCATIONS, profile.location, '')}
									/>
									{role === ROLES.MEMBER && (
										<Fact
											label="Availability"
											value={labelFor(AVAILABILITY_OPTIONS, profile.availability, '')}
										/>
									)}
								</>
							)}
						</dl>

						{(profile.linkedin || profile.website) && (
							<a
								href={profile.linkedin || profile.website}
								target="_blank"
								rel="noreferrer noopener"
								className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-900 hover:underline"
							>
								<Icon name="external" size="xs" />
								{profile.linkedin ? 'LinkedIn profile' : 'Company website'}
							</a>
						)}
					</Card>
				</aside>

				<div>
					{isEditing ? (
						<form onSubmit={form.handleSubmit} className="space-y-6" noValidate>
							{form.submitError && <Alert tone="danger">{form.submitError}</Alert>}

							<Card padding="lg">
								<h2 className="font-display text-lg font-semibold tracking-tight text-ink-900">
									Your name
								</h2>
								<div className="mt-4">
									<SchemaField
										field={{ name: 'name', label: 'Full name' }}
										form={form}
									/>
								</div>
							</Card>

							{steps.map((step) => (
								<Card key={step.id} padding="lg">
									<h2 className="font-display text-lg font-semibold tracking-tight text-ink-900">
										{step.title}
									</h2>
									<p className="mt-1 text-[13px] text-ink-500">{step.description}</p>

									<div className="mt-5 grid gap-5 sm:grid-cols-2">
										{step.fields.map((field) => (
											<div
												key={field.name}
												className={cn(field.colSpan === 2 && 'sm:col-span-2')}
											>
												<SchemaField field={field} form={form} />
											</div>
										))}
									</div>
								</Card>
							))}

							<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
								<Button
									variant="ghost"
									onClick={() => {
										form.reset(initialValues);
										setIsEditing(false);
									}}
									disabled={form.isSubmitting}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									size="lg"
									isLoading={form.isSubmitting}
									loadingText="Saving"
									leadingIcon="check"
								>
									Save changes
								</Button>
							</div>
						</form>
					) : (
						<div className="space-y-6">
							<Card padding="lg">
								<h2 className="font-display text-lg font-semibold tracking-tight text-ink-900">
									{isCompany ? 'About the company' : 'About'}
								</h2>
								<p className="mt-3 text-sm leading-relaxed text-ink-600">
									{profile.bio || (
										<span className="text-ink-400">
											Nothing here yet — add a short paragraph so people know who
											they are talking to.
										</span>
									)}
								</p>
							</Card>

							{profile.skills?.length > 0 && (
								<Card padding="lg">
									<h2 className="font-display text-lg font-semibold tracking-tight text-ink-900">
										{role === ROLES.MENTOR ? 'Areas of expertise' : 'Skills'}
									</h2>
									<div className="mt-4 flex flex-wrap gap-2">
										{profile.skills.map((skill) => (
											<Badge key={skill} tone="brand" size="lg">
												{skill}
											</Badge>
										))}
									</div>
								</Card>
							)}

							{(profile.goals?.length > 0 || profile.focusAreas?.length > 0) && (
								<Card padding="lg">
									<h2 className="font-display text-lg font-semibold tracking-tight text-ink-900">
										{role === ROLES.MENTOR ? 'Mentorship focus' : 'Career goals'}
									</h2>
									<div className="mt-4 flex flex-wrap gap-2">
										{(profile.goals ?? profile.focusAreas ?? []).map((goal) => (
											<Badge key={goal} tone="accent" size="lg">
												{labelFor(MENTORSHIP_GOALS, goal)}
											</Badge>
										))}
									</div>
								</Card>
							)}

							{profile.hiringFocus?.length > 0 && (
								<Card padding="lg">
									<h2 className="font-display text-lg font-semibold tracking-tight text-ink-900">
										Tracks we hire for
									</h2>
									<div className="mt-4 flex flex-wrap gap-2">
										{profile.hiringFocus.map((track) => (
											<Badge key={track} tone="accent" size="lg">
												{labelFor(CAREER_TRACKS, track)}
											</Badge>
										))}
									</div>
								</Card>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
