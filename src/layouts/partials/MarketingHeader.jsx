import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '../../components/icons/Icon';
import { Container } from '../../components/layout/Container';
import { Logo } from '../../components/common/Logo';
import { Button } from '../../components/ui/Button';
import { MARKETING_NAV } from '../../constants/navigation';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { cn } from '../../lib/cn';

/** Public site header: transparent over the hero, solid once scrolled. */
export const MarketingHeader = () => {
	const { isAuthenticated } = useAuth();
	const { pathname } = useLocation();
	const [isScrolled, setIsScrolled] = useState(false);

	// The mobile menu stores the route it was opened on, so navigating anywhere
	// closes it without a synchronising effect.
	const [menuPath, setMenuPath] = useState(null);
	const isMenuOpen = menuPath === pathname;
	const closeMenu = () => setMenuPath(null);

	useLockBodyScroll(isMenuOpen);

	useEffect(() => {
		const onScroll = () => setIsScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<header
			className={cn(
				'sticky top-0 z-40 transition-all duration-200',
				isScrolled
					? 'border-b border-line bg-canvas/85 backdrop-blur-md'
					: 'border-b border-transparent bg-transparent',
			)}
		>
			<Container className="flex h-18 items-center justify-between gap-6 py-3">
				<Logo />

				<nav
					aria-label="Primary"
					className="hidden items-center gap-1 lg:flex"
				>
					{MARKETING_NAV.map((item) => (
						<Link
							key={item.label}
							to={item.to}
							className="rounded-lg px-3 py-2 text-[13px] font-semibold text-ink-600 transition-colors hover:bg-ink-100/70 hover:text-ink-900"
						>
							{item.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-2">
					{isAuthenticated ? (
						<Button to={ROUTES.dashboard} size="sm" trailingIcon="arrow-right">
							Go to dashboard
						</Button>
					) : (
						<>
							<Button
								to={ROUTES.login}
								variant="ghost"
								size="sm"
								className="hidden sm:inline-flex"
							>
								Log in
							</Button>
							<Button to={ROUTES.signup} size="sm">
								Join the network
							</Button>
						</>
					)}

					<button
						type="button"
						onClick={() => setMenuPath(isMenuOpen ? null : pathname)}
						aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
						aria-expanded={isMenuOpen}
						className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-700 transition-colors hover:bg-ink-100 lg:hidden"
					>
						<Icon name={isMenuOpen ? 'close' : 'menu'} size="md" />
					</button>
				</div>
			</Container>

			{isMenuOpen && (
				<div className="border-t border-line bg-canvas lg:hidden">
					<Container className="flex flex-col gap-1 py-4">
						{MARKETING_NAV.map((item) => (
							<Link
								key={item.label}
								to={item.to}
								onClick={closeMenu}
								className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-100"
							>
								{item.label}
							</Link>
						))}

						{!isAuthenticated && (
							<Link
								to={ROUTES.login}
								onClick={closeMenu}
								className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-100 sm:hidden"
							>
								Log in
							</Link>
						)}
					</Container>
				</div>
			)}
		</header>
	);
};
