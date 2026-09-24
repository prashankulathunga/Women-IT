import { ROLES, ROLE_META } from '../../constants/roles';
import { CompanyOverview } from '../../features/dashboard/CompanyOverview';
import { MemberOverview } from '../../features/dashboard/MemberOverview';
import { MentorOverview } from '../../features/dashboard/MentorOverview';
import { WelcomePanel } from '../../features/dashboard/components/WelcomePanel';
import { useAuth } from '../../hooks/useAuth';

const OVERVIEWS = {
	[ROLES.MEMBER]: MemberOverview,
	[ROLES.MENTOR]: MentorOverview,
	[ROLES.COMPANY]: CompanyOverview,
};

/** Role-aware dashboard root: one route, three experiences. */
export const DashboardPage = () => {
	const { user, role, completion } = useAuth();
	const Overview = OVERVIEWS[role] ?? MemberOverview;

	const displayName =
		role === ROLES.COMPANY
			? user.profile?.companyName || user.name
			: user.name.split(' ')[0];

	return (
		<div className="space-y-8">
			<WelcomePanel
				name={displayName}
				subtitle={ROLE_META[role]?.tagline}
				completion={completion}
			/>

			<Overview />
		</div>
	);
};
