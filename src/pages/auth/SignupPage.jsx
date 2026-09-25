import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { Input } from '../../components/ui/Input';
import { OptionCard } from '../../components/ui/OptionCard';
import { Progress } from '../../components/ui/Progress';
import { ROLES, ROLE_META, SIGNUP_ROLES, requiresApproval } from '../../constants/roles';
import { WebcamCapture } from '../../features/verification/components/WebcamCapture';
import { Icon } from '../../components/icons/Icon';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../hooks/useToast';
import { passwordStrength, rules } from '../../lib/validators';

const ROLE_ICONS = {
	[ROLES.MEMBER]: 'user',
	[ROLES.MENTOR]: 'compass',
	[ROLES.COMPANY]: 'building',
};

const STRENGTH_TONE = {
	Weak: 'danger',
	Fair: 'warning',
	Good: 'brand',
	Strong: 'success',
};

export const SignupPage = () => {
	const { register } = useAuth();
	const toast = useToast();
	const navigate = useNavigate();

	const form = useForm({
		initialValues: {
			role: ROLES.MEMBER,
			name: '',
			email: '',
			password: '',
			photoDataUrl: null,
			terms: false,
		},
		validationSchema: {
			role: [rules.required('Choose an account type')],
			name: [
				rules.required('Enter your full name'),
				rules.minLength(2, 'That looks too short'),
			],
			email: [rules.required('Enter your email address'), rules.email()],
			password: [rules.required('Choose a password'), rules.strongPassword()],
			terms: [rules.accepted('Please accept the terms to continue')],
			// Only the woman-in-tech role is verified, so the photo is only
			// required when that role is selected.
			photoDataUrl: [
				(value, values) =>
					requiresApproval(values.role) && !value
						? 'Capture a live photo to continue'
						: undefined,
			],
		},
		onSubmit: async (values) => {
			const created = await register({
				name: values.name,
				email: values.email,
				password: values.password,
				role: values.role,
				photoDataUrl: values.photoDataUrl,
			});

			// Verified roles go to the holding screen; everyone else keeps the
			// behaviour they had before approval existed.
			if (requiresApproval(created.role)) {
				toast.success(
					'Your photo is with our team. We will let you know as soon as it is reviewed.',
					'Account submitted',
				);
				navigate(ROUTES.awaitingApproval, { replace: true });
				return;
			}

			toast.success('Account created. Let us set up your profile.', 'Welcome to Aruna');
			navigate(ROUTES.onboarding, { replace: true });
		},
	});

	const strength = passwordStrength(form.values.password);
	const isVerifiedRole = requiresApproval(form.values.role);

	return (
		<div>
			<h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
				Join the network
			</h1>
			<p className="mt-2 text-sm leading-relaxed text-ink-500">
				One account for jobs, mentorship and workshops. It takes about two minutes.
			</p>

			<form onSubmit={form.handleSubmit} className="mt-8 space-y-6" noValidate>
				{form.submitError && <Alert tone="danger">{form.submitError}</Alert>}

				<fieldset>
					<legend className="mb-2.5 text-[13px] font-semibold text-ink-800">
						I am joining as
					</legend>

					<div className="space-y-2.5">
						{SIGNUP_ROLES.map((role) => (
							<OptionCard
								key={role}
								name="role"
								value={role}
								icon={ROLE_ICONS[role]}
								title={ROLE_META[role].label}
								description={ROLE_META[role].signupBlurb}
								checked={form.values.role === role}
								onChange={(value) => form.setFieldValue('role', value)}
							/>
						))}
					</div>
				</fieldset>

				<div className="space-y-5">
					<Input
						label={
							form.values.role === ROLES.COMPANY ? 'Your full name' : 'Full name'
						}
						autoComplete="name"
						placeholder="Nimasha Perera"
						leadingIcon="user"
						required
						{...form.getFieldProps('name')}
					/>

					<Input
						label="Work email address"
						type="email"
						autoComplete="email"
						placeholder="you@company.lk"
						leadingIcon="mail"
						required
						{...form.getFieldProps('email')}
					/>

					<div>
						<Input
							label="Password"
							type="password"
							autoComplete="new-password"
							placeholder="At least 8 characters"
							required
							{...form.getFieldProps('password')}
						/>

						{form.values.password && (
							<Progress
								value={strength.score}
								tone={STRENGTH_TONE[strength.label] ?? 'danger'}
								size="xs"
								label={`Password strength: ${strength.label}`}
								className="mt-3"
							/>
						)}
					</div>
				</div>

				{isVerifiedRole && (
					<fieldset className="rounded-card border border-line bg-surface-muted/60 p-4 sm:p-5">
						<legend className="flex items-center gap-2 px-1 text-[13px] font-semibold text-ink-800">
							<Icon name="shield" size="xs" className="text-brand-700" />
							Live photo verification
							<span className="text-plum-600" aria-hidden="true">
								*
							</span>
						</legend>

						<p className="mt-1 mb-4 text-xs leading-relaxed text-ink-500">
							Aruna is a women-only community, so every member account is checked by
							a person before it opens. Take a live photo now — it is shown only to
							our review team, never on your profile.
						</p>

						<WebcamCapture
							value={form.values.photoDataUrl}
							onChange={(photo) => form.setFieldValue('photoDataUrl', photo)}
							error={form.touched.photoDataUrl ? form.errors.photoDataUrl : undefined}
							disabled={form.isSubmitting}
						/>
					</fieldset>
				)}

				<Checkbox
					name="terms"
					label="I agree to the Terms of Service and Privacy Policy"
					description="We never share your profile with employers without your explicit action."
					checked={form.values.terms}
					onChange={form.handleChange}
					error={form.touched.terms ? form.errors.terms : undefined}
				/>

				<Button
					type="submit"
					fullWidth
					size="lg"
					isLoading={form.isSubmitting}
					loadingText={isVerifiedRole ? 'Submitting for review' : 'Creating your account'}
					trailingIcon="arrow-right"
					disabled={isVerifiedRole && !form.values.photoDataUrl}
				>
					{isVerifiedRole ? 'Submit for review' : 'Create account'}
				</Button>

				{isVerifiedRole && !form.values.photoDataUrl && (
					<p className="-mt-3 text-center text-xs text-ink-400">
						Capture your photo above to enable this button.
					</p>
				)}
			</form>

			<p className="mt-8 text-center text-sm text-ink-500">
				Already have an account?{' '}
				<Link to={ROUTES.login} className="font-semibold text-brand-700 hover:underline">
					Log in
				</Link>
			</p>
		</div>
	);
};
