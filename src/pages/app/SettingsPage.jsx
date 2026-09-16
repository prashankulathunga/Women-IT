import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Checkbox } from '../../components/ui/Checkbox';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { ROLE_META } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { useDisclosure } from '../../hooks/useDisclosure';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../hooks/useToast';
import { formatDate } from '../../lib/format';
import { rules } from '../../lib/validators';

const NOTIFICATION_PREFS = [
	{
		name: 'jobAlerts',
		label: 'New roles matching my track and level',
		description: 'A weekly digest, not a daily one.',
	},
	{
		name: 'mentorUpdates',
		label: 'Mentorship request updates',
		description: 'When a mentor responds to you, or a mentee reaches out.',
	},
	{
		name: 'workshopReminders',
		label: 'Workshop reminders',
		description: 'A nudge 24 hours before a session you are registered for.',
	},
	{
		name: 'communityDigest',
		label: 'New articles and community stories',
		description: 'Published every other Tuesday.',
	},
];

export const SettingsPage = () => {
	const { user, role, changePassword, logout, updateProfile } = useAuth();
	const toast = useToast();
	const navigate = useNavigate();
	const signOutModal = useDisclosure();

	const passwordForm = useForm({
		initialValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
		validationSchema: {
			currentPassword: [rules.required('Enter your current password')],
			newPassword: [rules.required('Choose a new password'), rules.strongPassword()],
			confirmPassword: [
				rules.required('Confirm your new password'),
				rules.matches('newPassword', 'Passwords do not match'),
			],
		},
		onSubmit: async (values, { reset }) => {
			await changePassword({
				currentPassword: values.currentPassword,
				newPassword: values.newPassword,
			});
			toast.success('Your password has been changed.');
			reset();
		},
	});

	const notifications = user.profile?.notifications ?? {
		jobAlerts: true,
		mentorUpdates: true,
		workshopReminders: true,
		communityDigest: false,
	};

	const toggleNotification = async (name, checked) => {
		try {
			await updateProfile({ notifications: { ...notifications, [name]: checked } });
		} catch {
			toast.error('We could not save that preference.');
		}
	};

	const handleSignOut = async () => {
		await logout();
		toast.success('You have been signed out.');
		navigate(ROUTES.home);
	};

	return (
		<div className="max-w-3xl">
			<PageHeader
				eyebrow="Account"
				title="Settings"
				description="Security, notifications and account details."
			/>

			<div className="space-y-6">
				<Card padding="lg">
					<CardHeader
						title="Account"
						description="The details attached to your Aruna account."
					/>

					<dl className="mt-5 divide-y divide-line border-t border-line">
						{[
							['Name', user.name],
							['Email address', user.email],
							['Account type', ROLE_META[role]?.label],
							['Member since', formatDate(user.createdAt)],
						].map(([label, value]) => (
							<div key={label} className="flex items-baseline justify-between gap-4 py-3">
								<dt className="text-[13px] text-ink-400">{label}</dt>
								<dd className="text-right text-[13px] font-semibold text-ink-900">
									{value}
								</dd>
							</div>
						))}
					</dl>

					<Button to={ROUTES.profile} variant="secondary" size="sm" className="mt-5">
						Edit profile details
					</Button>
				</Card>

				<Card padding="lg">
					<CardHeader
						title="Notifications"
						description="We keep these deliberately quiet. Nothing is on by default that you did not ask for."
					/>

					<div className="mt-5 space-y-4 border-t border-line pt-5">
						{NOTIFICATION_PREFS.map((pref) => (
							<Checkbox
								key={pref.name}
								name={pref.name}
								label={pref.label}
								description={pref.description}
								checked={Boolean(notifications[pref.name])}
								onChange={(event) =>
									toggleNotification(pref.name, event.target.checked)
								}
							/>
						))}
					</div>
				</Card>

				<Card padding="lg">
					<CardHeader
						title="Password"
						description="Use at least eight characters with a mix of letters and numbers."
					/>

					<form
						onSubmit={passwordForm.handleSubmit}
						className="mt-5 space-y-5 border-t border-line pt-5"
						noValidate
					>
						{passwordForm.submitError && (
							<Alert tone="danger">{passwordForm.submitError}</Alert>
						)}

						<Input
							label="Current password"
							type="password"
							autoComplete="current-password"
							required
							{...passwordForm.getFieldProps('currentPassword')}
						/>

						<div className="grid gap-5 sm:grid-cols-2">
							<Input
								label="New password"
								type="password"
								autoComplete="new-password"
								required
								{...passwordForm.getFieldProps('newPassword')}
							/>
							<Input
								label="Confirm new password"
								type="password"
								autoComplete="new-password"
								required
								{...passwordForm.getFieldProps('confirmPassword')}
							/>
						</div>

						<Button
							type="submit"
							isLoading={passwordForm.isSubmitting}
							loadingText="Updating"
						>
							Update password
						</Button>
					</form>
				</Card>

				<Card padding="lg" className="border-danger-500/25">
					<CardHeader
						title="Sign out"
						description="You will need to log in again on this device."
						action={
							<Button variant="secondary" size="sm" onClick={signOutModal.open}>
								Sign out
							</Button>
						}
					/>
				</Card>
			</div>

			<Modal
				isOpen={signOutModal.isOpen}
				onClose={signOutModal.close}
				title="Sign out of Aruna?"
				description="Your applications, requests and registrations stay exactly as they are."
				size="sm"
				footer={
					<>
						<Button variant="ghost" onClick={signOutModal.close}>
							Stay signed in
						</Button>
						<Button variant="danger" onClick={handleSignOut}>
							Sign out
						</Button>
					</>
				}
			>
				<p className="text-sm leading-relaxed text-ink-600">
					You are signed in as{' '}
					<span className="font-semibold text-ink-900">{user.email}</span>.
				</p>
			</Modal>
		</div>
	);
};
