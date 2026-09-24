import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../../components/icons/Icon';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { ROLES, ROLE_META } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { cn } from '../../lib/cn';

/** Dashboard top bar: menu trigger, global search entry and the account menu. */
export const DashboardTopbar = ({ onOpenSidebar }) => {
	const { user, role, logout } = useAuth();
	const toast = useToast();
	const navigate = useNavigate();

	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef(null);

	useEffect(() => {
		if (!isMenuOpen) return undefined;

		const onPointerDown = (event) => {
			if (!menuRef.current?.contains(event.target)) setIsMenuOpen(false);
		};
		const onKeyDown = (event) => {
			if (event.key === 'Escape') setIsMenuOpen(false);
		};

		document.addEventListener('mousedown', onPointerDown);
		document.addEventListener('keydown', onKeyDown);
		return () => {
			document.removeEventListener('mousedown', onPointerDown);
			document.removeEventListener('keydown', onKeyDown);
		};
	}, [isMenuOpen]);

	const handleLogout = async () => {
		setIsMenuOpen(false);
		try {
			await logout();
			toast.success('You have been signed out.');
			navigate(ROUTES.home);
		} catch {
			toast.error('We could not sign you out. Please try again.');
		}
	};

	const menuItems = [
		{ label: 'My profile', to: ROUTES.profile, icon: 'user' },
		{ label: 'Settings', to: ROUTES.settings, icon: 'settings' },
	];

	// The search shortcut points at whichever surface that role actually
	// searches, so it never lands on a page their navigation does not offer.
	const search =
		role === ROLES.COMPANY
			? { to: ROUTES.companyApplicants, label: 'Search your postings and applicants' }
			: { to: ROUTES.jobs, label: 'Search roles, mentors and workshops' };

	return (
		<header className="sticky top-0 z-30 flex h-18 items-center gap-3 border-b border-line bg-canvas/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
			<button
				type="button"
				onClick={onOpenSidebar}
				aria-label="Open navigation"
				className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 transition-colors hover:bg-ink-100 lg:hidden"
			>
				<Icon name="menu" size="md" />
			</button>

			<Link
				to={search.to}
				className="group hidden h-10 flex-1 items-center gap-2.5 rounded-field border border-line-strong bg-white px-3.5 text-sm text-ink-400 transition-colors hover:border-ink-300 sm:flex lg:max-w-sm"
			>
				<Icon name="search" className="text-ink-400" />
				<span>{search.label}</span>
			</Link>

			<div className="flex flex-1 items-center justify-end gap-2">
				<Badge tone="outline" size="md" className="hidden sm:inline-flex">
					{ROLE_META[role]?.shortLabel ?? 'Member'}
				</Badge>

				<button
					type="button"
					aria-label="Notifications"
					className="relative flex h-10 w-10 items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-ink-100"
				>
					<Icon name="bell" size="md" />
					<span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-plum-500 ring-2 ring-canvas" />
				</button>

				<div className="relative" ref={menuRef}>
					<button
						type="button"
						onClick={() => setIsMenuOpen((value) => !value)}
						aria-haspopup="menu"
						aria-expanded={isMenuOpen}
						className={cn(
							'flex items-center gap-2 rounded-field p-1 pr-2 transition-colors',
							isMenuOpen ? 'bg-ink-100' : 'hover:bg-ink-100',
						)}
					>
						<Avatar name={user?.name} src={user?.profile?.avatarUrl} size="sm" />
						<span className="hidden max-w-32 truncate text-[13px] font-semibold text-ink-800 md:block">
							{user?.name}
						</span>
						<Icon name="chevron-down" size="xs" className="text-ink-400" />
					</button>

					{isMenuOpen && (
						<div
							role="menu"
							className="absolute right-0 top-full z-40 mt-2 w-60 overflow-hidden rounded-card border border-line bg-white shadow-elevated animate-rise"
						>
							<div className="border-b border-line px-4 py-3">
								<p className="truncate text-[13px] font-semibold text-ink-900">
									{user?.name}
								</p>
								<p className="truncate text-xs text-ink-400">{user?.email}</p>
							</div>

							<div className="p-1.5">
								{menuItems.map((item) => (
									<Link
										key={item.to}
										to={item.to}
										role="menuitem"
										onClick={() => setIsMenuOpen(false)}
										className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-ink-700 transition-colors hover:bg-ink-100"
									>
										<Icon name={item.icon} className="text-ink-400" />
										{item.label}
									</Link>
								))}
							</div>

							<div className="border-t border-line p-1.5">
								<button
									type="button"
									role="menuitem"
									onClick={handleLogout}
									className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-danger-500 transition-colors hover:bg-danger-50"
								>
									<Icon name="logout" />
									Log out
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};
