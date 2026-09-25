import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { Icon } from '../../components/icons/Icon';
import { Container } from '../../components/layout/Container';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { APPROVAL_STATUS } from '../../constants/options';
import { ROUTES } from '../../constants/routes';
import { WebcamCapture } from '../../features/verification/components/WebcamCapture';
import { useApprovalWatch } from '../../hooks/useApprovalWatch';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { formatDateTime } from '../../lib/format';

/**
 * Shown when an admin declines a woman-in-tech account.
 *
 * Decline is reversible by design: the most common cause is a dark or blurred
 * capture, and locking someone out permanently for that would be both unfair
 * and a support burden. The member may retake their photo, which puts them
 * back in the pending queue. An admin can also re-approve directly, which is
 * why this screen watches for status changes too.
 */
export const AccountDeclinedPage = () => {
	const { user, logout, refreshUser, resubmitVerification } = useAuth();
	const toast = useToast();
	const navigate = useNavigate();

	const [photo, setPhoto] = useState(null);
	const [isResubmitting, setIsResubmitting] = useState(false);
	const [isRetaking, setIsRetaking] = useState(false);
	const [error, setError] = useState(null);

	// Read fresh on mount — the decision may have changed since last render.
	useEffect(() => {
		refreshUser();
	}, [refreshUser]);

	const handleStatusChange = useCallback(
		(status) => {
			refreshUser();
			if (status === APPROVAL_STATUS.APPROVED) {
				toast.success('You are verified. Welcome to Aruna.', 'Account approved');
			}
		},
		[refreshUser, toast],
	);

	useApprovalWatch(user?.id, user?.approvalStatus, handleStatusChange);

	const handleResubmit = async () => {
		if (!photo) {
			setError('Capture a new photo before resubmitting.');
			return;
		}

		setIsResubmitting(true);
		setError(null);

		try {
			await resubmitVerification(photo);
			toast.success(
				'Your new photo is with our review team.',
				'Resubmitted for review',
			);
			navigate(ROUTES.awaitingApproval, { replace: true });
		} catch (caught) {
			setError(caught?.message || 'We could not resubmit your photo. Please try again.');
		} finally {
			setIsResubmitting(false);
		}
	};

	const handleLogout = async () => {
		await logout();
		navigate(ROUTES.home);
	};

	const reason = user?.declineReason;

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
						<span className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-50 text-danger-500">
							<Icon name="alert" size="xl" />
						</span>

						<h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink-900">
							We could not verify your account
						</h1>

						<p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-500">
							Our review team was not able to approve this account as submitted. In
							most cases this is about the photo itself, not about you — and you can
							try again below.
						</p>
					</div>

					<Card className="mt-8" padding="lg">
						<h2 className="font-display text-base font-semibold tracking-tight text-ink-900">
							What the team said
						</h2>

						<Alert tone="danger" className="mt-3" title={reason?.label ?? 'Not verified'}>
							{reason?.message ??
								'Your submission did not pass our verification check. Retake your photo in good light, facing the camera.'}
						</Alert>

						{user?.decisionAt && (
							<p className="mt-3 text-xs text-ink-400">
								Reviewed {formatDateTime(user.decisionAt)}
							</p>
						)}
					</Card>

					{reason?.value === 'not-eligible' ? (
						<Card className="mt-6" variant="muted" padding="lg">
							<h2 className="font-display text-base font-semibold tracking-tight text-ink-900">
								Think this is a mistake?
							</h2>
							<p className="mt-2 text-[13px] leading-relaxed text-ink-600">
								Eligibility decisions are not reversed from this screen. Reply to
								the email we sent, or write to{' '}
								<span className="font-semibold text-ink-900">hello@aruna.lk</span>{' '}
								and a person will look at it again.
							</p>
						</Card>
					) : (
						<Card className="mt-6" padding="lg">
							<h2 className="font-display text-base font-semibold tracking-tight text-ink-900">
								Try again
							</h2>
							<p className="mt-2 text-[13px] leading-relaxed text-ink-600">
								Retake your photo and we will put you back in the review queue.
								Face the camera straight on, somewhere well lit, with nothing
								covering your face.
							</p>

							{isRetaking ? (
								<div className="mt-5">
									<WebcamCapture
										value={photo}
										onChange={(next) => {
											setPhoto(next);
											setError(null);
										}}
										error={error}
										disabled={isResubmitting}
									/>

									<div className="mt-4 flex flex-wrap items-center gap-2">
										<Button
											onClick={handleResubmit}
											disabled={!photo}
											isLoading={isResubmitting}
											loadingText="Resubmitting"
											trailingIcon="arrow-right"
										>
											Resubmit for review
										</Button>
										<Button
											variant="ghost"
											onClick={() => {
												setIsRetaking(false);
												setPhoto(null);
												setError(null);
											}}
											disabled={isResubmitting}
										>
											Cancel
										</Button>
									</div>
								</div>
							) : (
								<Button
									className="mt-5"
									leadingIcon="user"
									onClick={() => setIsRetaking(true)}
								>
									Retake my photo
								</Button>
							)}
						</Card>
					)}

					<p className="mt-8 text-center text-xs leading-relaxed text-ink-400">
						Signed in as {user?.email} ·{' '}
						<button
							type="button"
							onClick={handleLogout}
							className="font-semibold text-brand-700 hover:underline"
						>
							Log out
						</button>
					</p>
				</div>
			</Container>
		</div>
	);
};
