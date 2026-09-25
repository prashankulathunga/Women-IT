import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Icon } from '../../../components/icons/Icon';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/cn';

/**
 * Live webcam capture for identity verification.
 *
 * Deliberately camera-only — there is no file input, because a chosen image
 * file defeats the purpose of the check. `react-webcam` renders a live
 * `<video>` stream and `getScreenshot()` returns a base64 JPEG data URL, which
 * is what we persist on the user record.
 *
 * Camera access can fail for reasons the user can fix (denied permission) and
 * reasons they cannot (no device, browser blocks non-HTTPS origins). Both are
 * surfaced inline with a retry rather than throwing, so the signup form stays
 * usable.
 */

const VIDEO_CONSTRAINTS = {
	width: 640,
	height: 480,
	facingMode: 'user',
};

const errorCopyFor = (error) => {
	switch (error?.name) {
		case 'NotAllowedError':
		case 'PermissionDeniedError':
			return 'Camera access was blocked. Allow camera access for this site in your browser, then try again.';
		case 'NotFoundError':
		case 'DevicesNotFoundError':
			return 'We could not find a camera on this device. Connect one and try again.';
		case 'NotReadableError':
		case 'TrackStartError':
			return 'Your camera is already in use by another app. Close it and try again.';
		default:
			return 'We could not start your camera. Check that this site is allowed to use it, then try again.';
	}
};

export const WebcamCapture = ({ value, onChange, error, disabled = false }) => {
	const webcamRef = useRef(null);

	const [cameraError, setCameraError] = useState(null);
	const [isReady, setIsReady] = useState(false);
	// Remounts <Webcam> on retry so the browser is asked for the stream again.
	const [attempt, setAttempt] = useState(0);

	const handleCapture = useCallback(() => {
		const shot = webcamRef.current?.getScreenshot();
		if (!shot) {
			setCameraError('The camera did not return an image. Try again.');
			return;
		}
		onChange?.(shot);
	}, [onChange]);

	const handleRetake = useCallback(() => {
		onChange?.(null);
		setIsReady(false);
	}, [onChange]);

	const handleRetry = useCallback(() => {
		setCameraError(null);
		setIsReady(false);
		setAttempt((count) => count + 1);
	}, []);

	const hasPhoto = Boolean(value);

	return (
		<div>
			<div
				className={cn(
					'relative overflow-hidden rounded-card border bg-ink-900',
					error ? 'border-danger-500' : 'border-line-strong',
				)}
			>
				<div className="aspect-[4/3] w-full">
					{hasPhoto ? (
						<img
							src={value}
							alt="Your captured verification photo"
							className="h-full w-full object-cover"
						/>
					) : cameraError ? (
						<div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
							<span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
								<Icon name="alert" size="md" />
							</span>
							<p className="max-w-xs text-[13px] leading-relaxed text-white/80">
								{cameraError}
							</p>
							<Button size="sm" variant="secondary" onClick={handleRetry}>
								Try camera again
							</Button>
						</div>
					) : (
						<>
							<Webcam
								key={attempt}
								ref={webcamRef}
								audio={false}
								mirrored
								screenshotFormat="image/jpeg"
								screenshotQuality={0.8}
								videoConstraints={VIDEO_CONSTRAINTS}
								onUserMedia={() => {
									setIsReady(true);
									setCameraError(null);
								}}
								onUserMediaError={(mediaError) => {
									setIsReady(false);
									setCameraError(errorCopyFor(mediaError));
								}}
								className="h-full w-full object-cover"
							/>

							{!isReady && (
								<div className="absolute inset-0 flex items-center justify-center gap-2.5 bg-ink-900 text-[13px] text-white/70">
									<svg
										className="h-4 w-4 animate-spin"
										viewBox="0 0 24 24"
										fill="none"
										aria-hidden="true"
									>
										<circle
											cx="12"
											cy="12"
											r="9"
											stroke="currentColor"
											strokeWidth="2.5"
											className="opacity-25"
										/>
										<path
											d="M21 12a9 9 0 0 0-9-9"
											stroke="currentColor"
											strokeWidth="2.5"
											strokeLinecap="round"
										/>
									</svg>
									Starting your camera…
								</div>
							)}
						</>
					)}
				</div>

				{hasPhoto && (
					<span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-success-500 px-2.5 py-1 text-[11px] font-semibold text-white">
						<Icon name="check" size="xs" strokeWidth={3} />
						Photo captured
					</span>
				)}
			</div>

			<div className="mt-3 flex flex-wrap items-center gap-2">
				{hasPhoto ? (
					<Button
						size="sm"
						variant="secondary"
						leadingIcon="eye"
						onClick={handleRetake}
						disabled={disabled}
					>
						Retake photo
					</Button>
				) : (
					<Button
						size="sm"
						leadingIcon="user"
						onClick={handleCapture}
						disabled={disabled || !isReady || Boolean(cameraError)}
					>
						Capture photo
					</Button>
				)}

				<p className="text-xs text-ink-400">
					{hasPhoto
						? 'Looks clear? You can retake it as many times as you like.'
						: 'Face the camera in good light. Nothing is uploaded until you submit.'}
				</p>
			</div>

			{error && (
				<p role="alert" className="mt-2 flex items-start gap-1.5 text-xs font-medium text-danger-500">
					<Icon name="alert" size="xs" className="mt-px" />
					{error}
				</p>
			)}
		</div>
	);
};
