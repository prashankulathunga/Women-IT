import { Icon } from '../../components/icons/Icon';
import { Container } from '../../components/layout/Container';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

export const NotFoundPage = () => {
	const { isAuthenticated } = useAuth();

	return (
		<Container width="sm" className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
			<span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700">
				<Icon name="compass" size="xl" />
			</span>

			<p className="mt-6 font-display text-6xl font-semibold tracking-tight text-brand-900">
				404
			</p>

			<h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink-900">
				We could not find that page
			</h1>

			<p className="mt-3 max-w-md text-sm leading-relaxed text-ink-500">
				The link may be out of date, or the role or article it pointed to may have been
				taken down.
			</p>

			<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
				<Button to={isAuthenticated ? ROUTES.dashboard : ROUTES.home} leadingIcon="arrow-left">
					{isAuthenticated ? 'Back to dashboard' : 'Back to home'}
				</Button>
				<Button to={ROUTES.jobs} variant="secondary">
					Browse the job board
				</Button>
			</div>
		</Container>
	);
};
