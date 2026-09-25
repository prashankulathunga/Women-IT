import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { Icon } from '../../components/icons/Icon';
import { Container } from '../../components/layout/Container';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { APPROVAL_STATUS } from '../../constants/options';
import { ROUTES } from '../../constants/routes';
import { useApprovalWatch } from '../../hooks/useApprovalWatch';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { formatDateTime, formatRelativeTime } from '../../lib/format';

const STEPS = [
	{
		icon: 'check-circle',
		title: 'Account created',
		copy: 'Your details and photo are saved.',
		state: 'done',
	},
	{
		icon: 'clock',
		title: 'Under review',
		copy: 'A member of our team is checking your photo.',
		state: 'current',
	},
	{
		icon: 'sparkle',
		title: 'Welcome in',
		copy: 'You get full access to jobs, mentors and workshops.',
		state: 'upcoming',
	},
];

/**
 * Holding screen for a woman-in-tech account awaiting admin approval.
 *
 * The screen does not poll a server — there isn't one. `useApprovalWatch`
 * listens for the `storage` event (fires in other tabs when the admin writes)
 * and also re-reads localStorage every few seconds as a fallback. When the
 * status flips, we refresh the user in context and the route guard moves them
 * on by itself. See the hook for why both mechanisms are needed.
 */
export const AwaitingApprovalPage = () => {
	const { user, logout, refreshUser } = useAuth();
	const toast = useToast();
	const navigate = useNavigate();

	const [lastCheckedAt, setLastCheckedAt] = useState(() => new Date().toISOString());

	// On mount, read the status straight from storage rather than trusting the
	// in-memory copy — the user may have refreshed after a decision landed.
	useEffect(() => {
		refreshUser();
	}, [refreshUser]);

	const handleStatusChange = useCallback(
		(status) => {
			setLastCheckedAt(new Date().toISOString());
			refreshUser();

			if (status === APPROVAL_STATUS.APPROVED) {
				toast.success(
					'You are verified. Welcome to Aruna.',
					'Account approved',
				);
			}
			// Declined is handled by the guard, which routes to /account-declined.
		},
		[refreshUser, toast],
	);

	useApprovalWatch(user?.id, user?.approvalStatus, handleStatusChange);

	const handleManualCheck = () => {
		setLastCheckedAt(new Date().toISOString());
		const fresh = refreshUser();

		if (fresh?.approvalStatus === APPROVAL_STATUS.PENDING) {
			toast.info('Still under review. We are checking automatically too.');
		}
	};

	const handleLogout = async () => {
		await logout();
		navigate(ROUTES.home);
	};

	return (
		<div className="min-h-screen bg-canvas">
			<header className="border-b border-line bg-white/70 backdrop-blur-sm">
				<Container width="md" className="flex h-18 items-center justify-between gap-4">
					<Logo showTagline={false} to={null} />
					<button
						type="button"
						onClick={handleLogout}
						className="text-[13px] font-semibold text-ink-500 transition-colors hover:text-ink-900"
					>
						Log out
					</button>
				</Container>
			</header>

			<Container width="md" className="py-12 sm:py-16">
				<div className="mx-auto max-w-2xl">
					<div className="flex flex-col items-center text-center">
						<span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-warning-50 text-warning-700">
							<span className="absolute inset-0 animate-ping rounded-full bg-warning-500/15" />
							<Icon name="clock" size="xl" className="relative" />
						</span>

						<h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink-900">
							Your account is under review
						</h1>

						<p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-500">
							Aruna is a women-only community, so a person checks every new member
							account. This usually takes a few hours during working days in Colombo.
							You do not need to keep this page open — but if you do, it will let you
							straight in the moment you are approved.
						</p>
					</div>

					<Card className="mt-8" padding="lg">
						<ol className="space-y-5">
							{STEPS.map((step) => (
								<li key={step.title} className="flex gap-4">
									<span
										className={
											step.state === 'done'
												? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success-50 text-success-700'
												: step.state === 'current'
													? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warning-50 text-warning-700'
													: 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-400'
										}
									>
										<Icon name={step.icon} size="md" />
									</span>

									<div className="min-w-0 pt-1">
										<p
											className={
												step.state === 'upcoming'
													? 'text-sm font-semibold text-ink-400'
													: 'text-sm font-semibold text-ink-900'
											}
										>
											{step.title}
										</p>
										<p className="mt-0.5 text-[13px] leading-relaxed text-ink-500">
											{step.copy}
										</p>
									</div>
								</li>
							))}
						</ol>

						<dl className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
							<div>
								<dt className="text-xs text-ink-400">Submitted</dt>
								<dd className="mt-0.5 text-[13px] font-semibold text-ink-900">
									{formatDateTime(user?.signupAt ?? user?.createdAt)}
								</dd>
							</div>
							<div>
								<dt className="text-xs text-ink-400">Account</dt>
								<dd className="mt-0.5 truncate text-[13px] font-semibold text-ink-900">
									{user?.email}
								</dd>
							</div>
						</dl>
					</Card>

					<div className="mt-6 flex flex-col items-center gap-3">
						<Button variant="secondary" leadingIcon="spark" onClick={handleManualCheck}>
							Check now
						</Button>

						<p className="text-xs text-ink-400">
							Checking automatically · last checked{' '}
							{formatRelativeTime(lastCheckedAt)}
						</p>
					</div>

					<p className="mt-8 text-center text-xs leading-relaxed text-ink-400">
						Wrong account?{' '}
						<button
							type="button"
							onClick={handleLogout}
							className="font-semibold text-brand-700 hover:underline"
						>
							Log out
						</button>{' '}
						and sign in with a different one.
					</p>
				</div>
			</Container>
		</div>
	);
};
