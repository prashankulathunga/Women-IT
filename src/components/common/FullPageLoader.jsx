import { Logo } from './Logo';

/** Whole-screen loading state used while the session resolves or a route lazy-loads. */
export const FullPageLoader = ({ label = 'Loading' }) => (
	<div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas">
		<Logo size="lg" />

		<div className="flex items-center gap-2.5 text-sm text-ink-500">
			<svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<circle
					cx="12"
					cy="12"
					r="9"
					stroke="currentColor"
					strokeWidth="2.5"
					className="opacity-20"
				/>
				<path
					d="M21 12a9 9 0 0 0-9-9"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
				/>
			</svg>
			<span>{label}…</span>
		</div>
	</div>
);
