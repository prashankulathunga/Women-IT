import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { SchemaField } from '../../components/common/SchemaField';
import { Icon } from '../../components/icons/Icon';
import { Container } from '../../components/layout/Container';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';
import { ROLES, ROLE_META } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../hooks/useToast';
import { cn } from '../../lib/cn';
import {
	initialValuesFromProfile,
	schemaFromFields,
	stepsForRole,
} from '../../features/profile/profileFields';

/**
 * Post-signup profile capture.
 *
 * Steps, fields and validation all come from `profileFields.js`, so the same
 * definitions drive onboarding and the profile editor. Values persist across
 * steps; only the current step is validated on "Continue".
 */
export const OnboardingPage = () => {
	const { user, role, updateProfile } = useAuth();
	const toast = useToast();
	const navigate = useNavigate();

	const steps = useMemo(() => stepsForRole(role), [role]);
	const [stepIndex, setStepIndex] = useState(0);

	const currentStep = steps[stepIndex];
	const isLastStep = stepIndex === steps.length - 1;

	const initialValues = useMemo(
		() => initialValuesFromProfile(role, user?.profile),
		[role, user?.profile],
	);

	// Only the current step is validated, so a later step's empty fields never
	// block "Continue".
	const validationSchema = useMemo(
		() => schemaFromFields(currentStep.fields),
		[currentStep],
	);

	const form = useForm({
		initialValues,
		validationSchema,
		onSubmit: async (values) => {
			if (!isLastStep) {
				setStepIndex((index) => index + 1);
				window.scrollTo({ top: 0, behavior: 'smooth' });
				return;
			}

			await updateProfile(values, { completeOnboarding: true });
			toast.success('Your profile is live. Welcome to Aruna.', 'All set');
			navigate(ROUTES.dashboard, { replace: true });
		},
	});

	/** Persists whatever has been entered so far without completing onboarding. */
	const saveAndExit = async () => {
		try {
			await updateProfile(form.values);
			toast.info('Progress saved. Pick up where you left off any time.');
		} catch {
			toast.error('We could not save your progress.');
		} finally {
			navigate(ROUTES.home);
		}
	};

	const goBack = () => {
		if (stepIndex === 0) return;
		setStepIndex((index) => index - 1);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const progress = ((stepIndex + (form.isSubmitting ? 1 : 0)) / steps.length) * 100;

	return (
		<div className="min-h-screen bg-canvas">
			<header className="border-b border-line bg-white/70 backdrop-blur-sm">
				<Container width="md" className="flex h-18 items-center justify-between gap-4">
					<Logo showTagline={false} to={null} />

					<button
						type="button"
						onClick={saveAndExit}
						className="text-[13px] font-semibold text-ink-500 transition-colors hover:text-ink-900"
					>
						Save and exit
					</button>
				</Container>
			</header>

			<Container width="md" className="py-10 sm:py-14">
				<div className="mb-8">
					<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
						{ROLE_META[role]?.label ?? 'Member'} · Step {stepIndex + 1} of{' '}
						{steps.length}
					</p>

					<h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900">
						{currentStep.title}
					</h1>
					<p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-500">
						{currentStep.description}
					</p>

					<Progress value={progress} tone="brand" className="mt-6" size="sm" />

					<ol className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
						{steps.map((step, index) => (
							<li
								key={step.id}
								className={cn(
									'flex items-center gap-2 text-xs font-semibold',
									index === stepIndex
										? 'text-brand-900'
										: index < stepIndex
											? 'text-success-700'
											: 'text-ink-400',
								)}
							>
								<span
									className={cn(
										'flex h-5 w-5 items-center justify-center rounded-full text-[10px]',
										index === stepIndex
											? 'bg-brand-900 text-white'
											: index < stepIndex
												? 'bg-success-50 text-success-700'
												: 'bg-ink-200 text-ink-500',
									)}
								>
									{index < stepIndex ? (
										<Icon name="check" size="xs" strokeWidth={3} />
									) : (
										index + 1
									)}
								</span>
								{step.title}
							</li>
						))}
					</ol>
				</div>

				<form
					onSubmit={form.handleSubmit}
					className="rounded-panel border border-line bg-white p-6 shadow-subtle sm:p-8"
					noValidate
				>
					{form.submitError && (
						<Alert tone="danger" className="mb-6">
							{form.submitError}
						</Alert>
					)}

					<div className="grid gap-5 sm:grid-cols-2">
						{currentStep.fields.map((field) => (
							<div
								key={field.name}
								className={cn(field.colSpan === 2 && 'sm:col-span-2')}
							>
								<SchemaField field={field} form={form} />
							</div>
						))}
					</div>

					<div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
						<Button
							variant="ghost"
							onClick={goBack}
							disabled={stepIndex === 0 || form.isSubmitting}
							leadingIcon="arrow-left"
						>
							Back
						</Button>

						<Button
							type="submit"
							size="lg"
							isLoading={form.isSubmitting}
							loadingText="Saving"
							trailingIcon={isLastStep ? 'check' : 'arrow-right'}
						>
							{isLastStep ? 'Finish and go to dashboard' : 'Continue'}
						</Button>
					</div>
				</form>

				<p className="mt-6 text-center text-xs leading-relaxed text-ink-400">
					{role === ROLES.COMPANY
						? 'You can edit anything here later from your profile. Candidates only see this once you publish a role.'
						: role === ROLES.MENTOR
							? 'You can edit anything here later from your profile. Mentees only see your profile once it is complete.'
							: 'You can edit anything here later from your profile. Nothing is shared with employers until you apply to a role.'}
				</p>
			</Container>
		</div>
	);
};
