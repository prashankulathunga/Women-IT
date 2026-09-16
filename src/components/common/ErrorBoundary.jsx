import { Component } from 'react';
import { Icon } from '../icons/Icon';

/**
 * Top-level crash guard.
 *
 * Class component because React still has no hook equivalent for
 * `componentDidCatch`. It renders a recoverable screen rather than a white
 * page, and keeps the error visible in the console for debugging.
 */
export class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { error: null };
		this.handleReset = this.handleReset.bind(this);
	}

	static getDerivedStateFromError(error) {
		return { error };
	}

	componentDidCatch(error, info) {
		// Replace with the real reporting sink (Sentry, Datadog) when available.
		console.error('Unhandled UI error:', error, info?.componentStack);
	}

	handleReset() {
		this.setState({ error: null });
		window.location.assign('/');
	}

	render() {
		const { error } = this.state;
		const { children } = this.props;

		if (!error) return children;

		return (
			<div className="flex min-h-screen items-center justify-center bg-canvas px-4">
				<div className="w-full max-w-md rounded-panel border border-line bg-white p-8 text-center shadow-raised">
					<span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger-50 text-danger-500">
						<Icon name="alert" size="lg" />
					</span>

					<h1 className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink-900">
						Something went wrong
					</h1>

					<p className="mt-2 text-sm leading-relaxed text-ink-500">
						An unexpected error stopped this page from rendering. Returning to the
						home page usually clears it.
					</p>

					<button
						type="button"
						onClick={this.handleReset}
						className="mt-6 inline-flex h-11 items-center justify-center rounded-field bg-brand-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
					>
						Back to home
					</button>
				</div>
			</div>
		);
	}
}
