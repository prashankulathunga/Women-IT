import { NavLink } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { Icon } from '../../components/icons/Icon';
import { Progress } from '../../components/ui/Progress';
import { navigationForRole } from '../../constants/navigation';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/cn';

/**
 * Role-aware dashboard navigation.
 *
 * Rendered from `navigationForRole`, so the desktop rail and the mobile
 * drawer can never show different items.
 */
export const DashboardSidebar = ({ onNavigate }) => {
	const { role, completion, user } = useAuth();
	const sections = navigationForRole(role);

	return (
		<div className="flex h-full flex-col bg-white">
			<div className="flex h-18 shrink-0 items-center border-b border-line px-5">
				<Logo showTagline={false} to={ROUTES.dashboard} />
			</div>

			<nav
				aria-label="Dashboard"
				className="flex-1 space-y-6 overflow-y-auto px-3 py-5"
			>
				{sections.map((section) => (
					<div key={section.title}>
						<p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-400">
							{section.title}
						</p>

						<ul className="space-y-0.5">
							{section.items.map((item) => (
								<li key={`${section.title}-${item.label}`}>
									<NavLink
										to={item.to}
										end={item.end}
										onClick={onNavigate}
										className={({ isActive }) =>
											cn(
												'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-all duration-150',
												isActive
													? 'bg-brand-900 text-white shadow-subtle'
													: 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
											)
										}
									>
										{({ isActive }) => (
											<>
												<Icon
													name={item.icon}
													className={cn(
														'transition-colors',
														isActive ? 'text-white' : 'text-ink-400 group-hover:text-ink-700',
													)}
												/>
												<span className="truncate">{item.label}</span>
											</>
										)}
									</NavLink>
								</li>
							))}
						</ul>
					</div>
				))}
			</nav>

			{completion < 100 && (
				<div className="shrink-0 border-t border-line p-4">
					<div className="rounded-card bg-brand-50 p-4">
						<div className="flex items-start gap-2.5">
							<Icon name="lightbulb" className="mt-0.5 text-brand-700" />
							<div className="min-w-0">
								<p className="text-[13px] font-semibold text-brand-900">
									Complete your profile
								</p>
								<p className="mt-1 text-xs leading-relaxed text-brand-800/70">
									Profiles above 80% get roughly three times more responses.
								</p>
							</div>
						</div>

						<Progress value={completion} tone="brand" className="mt-3" showValue />

						<NavLink
							to={ROUTES.profile}
							onClick={onNavigate}
							className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-900 hover:underline"
						>
							Finish setup
							<Icon name="arrow-right" size="xs" />
						</NavLink>
					</div>
				</div>
			)}

			<div className="shrink-0 border-t border-line px-5 py-4">
				<p className="truncate text-[13px] font-semibold text-ink-900">{user?.name}</p>
				<p className="truncate text-xs text-ink-400">{user?.email}</p>
			</div>
		</div>
	);
};
