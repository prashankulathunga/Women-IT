import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { Input } from '../../components/ui/Input';
import { OptionCard } from '../../components/ui/OptionCard';
import { Progress } from '../../components/ui/Progress';
import { ROLES, ROLE_LIST, ROLE_META } from '../../constants/roles';
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
		},
		onSubmit: async (values) => {
			await register({
				name: values.name,
				email: values.email,
				password: values.password,
				role: values.role,
			});

			toast.success('Account created. Let us set up your profile.', 'Welcome to Aruna');
			navigate(ROUTES.onboarding, { replace: true });
		},
	});

	const strength = passwordStrength(form.values.password);

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
						{ROLE_LIST.map((role) => (
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
					loadingText="Creating your account"
					trailingIcon="arrow-right"
				>
					Create account
				</Button>
			</form>

			<p className="mt-8 text-center text-sm text-ink-500">
				Already have an account?{' '}
				<Link to={ROUTES.login} className="font-semibold text-brand-900 hover:underline">
					Log in
				</Link>
			</p>
		</div>
	);
};
