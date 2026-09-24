import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { Input } from '../../components/ui/Input';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../hooks/useToast';
import { rules } from '../../lib/validators';

export const LoginPage = () => {
	const { login } = useAuth();
	const toast = useToast();
	const navigate = useNavigate();
	const location = useLocation();

	// Send people back to wherever the guard intercepted them.
	const redirectTo = location.state?.from?.pathname ?? ROUTES.dashboard;

	const form = useForm({
		initialValues: { email: '', password: '', remember: true },
		validationSchema: {
			email: [rules.required('Enter your email address'), rules.email()],
			password: [rules.required('Enter your password')],
		},
		onSubmit: async (values) => {
			const user = await login({ email: values.email, password: values.password });
			toast.success(`Welcome back, ${user.name.split(' ')[0]}.`);
			navigate(user.onboardingComplete ? redirectTo : ROUTES.onboarding, {
				replace: true,
			});
		},
	});

	return (
		<div>
			<h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
				Welcome back
			</h1>
			<p className="mt-2 text-sm leading-relaxed text-ink-500">
				Log in to pick up your applications, mentor conversations and saved roles.
			</p>

			<form onSubmit={form.handleSubmit} className="mt-8 space-y-5" noValidate>
				{form.submitError && <Alert tone="danger">{form.submitError}</Alert>}

				<Input
					label="Email address"
					type="email"
					autoComplete="email"
					placeholder="you@company.lk"
					leadingIcon="mail"
					required
					{...form.getFieldProps('email')}
				/>

				<Input
					label="Password"
					type="password"
					autoComplete="current-password"
					placeholder="••••••••"
					required
					labelAddon={
						<Link
							to={ROUTES.login}
							className="text-xs font-semibold text-brand-900 hover:underline"
						>
							Forgot password?
						</Link>
					}
					{...form.getFieldProps('password')}
				/>

				<Checkbox
					name="remember"
					label="Keep me signed in on this device"
					checked={form.values.remember}
					onChange={form.handleChange}
				/>

				<Button
					type="submit"
					fullWidth
					size="lg"
					isLoading={form.isSubmitting}
					loadingText="Signing you in"
					trailingIcon="arrow-right"
				>
					Log in
				</Button>
			</form>

			<p className="mt-8 text-center text-sm text-ink-500">
				New to Aruna?{' '}
				<Link
					to={ROUTES.signup}
					className="font-semibold text-brand-900 hover:underline"
				>
					Create an account
				</Link>
			</p>
		</div>
	);
};
