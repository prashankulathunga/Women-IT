import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Icon } from '../components/icons/Icon';
import { useDisclosure } from '../hooks/useDisclosure';
import { useIsDesktop } from '../hooks/useMediaQuery';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { DashboardSidebar } from './partials/DashboardSidebar';
import { DashboardTopbar } from './partials/DashboardTopbar';

/**
 * Authenticated application shell.
 *
 * A fixed rail on desktop, an overlay drawer below `lg`. The drawer closes on
 * navigation and when the viewport grows, so the two modes never conflict.
 */
export const DashboardLayout = () => {
	const { isOpen, open, close } = useDisclosure(false);
	const isDesktop = useIsDesktop();
	const { pathname } = useLocation();

	useLockBodyScroll(isOpen && !isDesktop);

	// Close on navigation and when the viewport grows past the drawer breakpoint.
	// `close` is a stable callback, so this never fires on an unrelated render.
	useEffect(() => {
		close();
	}, [pathname, isDesktop, close]);

	return (
		<div className="min-h-screen bg-canvas">
			{/* Desktop rail */}
			<aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line lg:block">
				<DashboardSidebar />
			</aside>

			{/* Mobile drawer */}
			{isOpen && !isDesktop && (
				<div className="fixed inset-0 z-50 lg:hidden">
					<div
						className="absolute inset-0 bg-ink-950/45 backdrop-blur-[2px] animate-fade-in"
						onClick={close}
						aria-hidden="true"
					/>

					<div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-elevated">
						<button
							type="button"
							onClick={close}
							aria-label="Close navigation"
							className="absolute right-3 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100"
						>
							<Icon name="close" size="md" />
						</button>

						<DashboardSidebar onNavigate={close} />
					</div>
				</div>
			)}

			<div className="lg:pl-64">
				<DashboardTopbar onOpenSidebar={open} />

				<main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
					<div className="mx-auto w-full max-w-6xl">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
};
