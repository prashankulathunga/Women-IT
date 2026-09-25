import { ROLES, ROLE_META } from '../../constants/roles';
import { AdminOverview } from '../../features/dashboard/AdminOverview';
import { CompanyOverview } from '../../features/dashboard/CompanyOverview';
import { MemberOverview } from '../../features/dashboard/MemberOverview';
import { MentorOverview } from '../../features/dashboard/MentorOverview';
import { WelcomePanel } from '../../features/dashboard/components/WelcomePanel';
import { useAuth } from '../../hooks/useAuth';

const OVERVIEWS = {
	[ROLES.MEMBER]: MemberOverview,
	[ROLES.MENTOR]: MentorOverview,
	[ROLES.COMPANY]: CompanyOverview,
	[ROLES.ADMIN]: AdminOverview,
};

/** Role-aware dashboard root: one route, three experiences. */
export const DashboardPage = () => {
	const { user, role, completion } = useAuth();
	const Overview = OVERVIEWS[role] ?? MemberOverview;

	const displayName =
		role === ROLES.COMPANY
			? user.profile?.companyName || user.name
			: user.name.split(' ')[0];

	// Staff have no profile to complete, so the nudge is suppressed for them.
	const nudge = role === ROLES.ADMIN ? 100 : completion;

	return (
		<div className="space-y-8">
			<WelcomePanel
				name={displayName}
				subtitle={ROLE_META[role]?.tagline}
				completion={nudge}
			/>

			<Overview />
		</div>
	);
};
