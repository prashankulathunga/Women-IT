import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { FullPageLoader } from '../../components/common/FullPageLoader';
import { requiresApproval } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { landingRouteFor } from './landingRoute';

/**
 * Route guards.
 *
 * All of them wait for `isBootstrapping` to settle so a signed-in user is
 * never bounced to /login while the persisted session is still resolving.
 *
 * Gate order for a woman-in-tech account is verification → onboarding →
 * product, and it is enforced here rather than in any page, so a member who
 * signs up, closes the tab and logs back in a day later while still pending
 * lands on /awaiting-approval again rather than the dashboard.
 */

/** Requires a session, a cleared verification, and (by default) a profile. */
export const ProtectedRoute = ({ requireOnboarding = true }) => {
	const { isAuthenticated, isBootstrapping, user } = useAuth();
	const location = useLocation();

	if (isBootstrapping) return <FullPageLoader label="Checking your session" />;

	if (!isAuthenticated) {
		return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
	}

	// Verification is checked before onboarding and applies to every protected
	// route, including /onboarding itself.
	const destination = landingRouteFor(user);
	const isBlockedByVerification =
		destination === ROUTES.awaitingApproval || destination === ROUTES.accountDeclined;

	if (isBlockedByVerification) return <Navigate to={destination} replace />;

	if (requireOnboarding && !user.onboardingComplete) {
		return <Navigate to={ROUTES.onboarding} replace />;
	}

	return <Outlet />;
};

/** Keeps signed-in users away from login/signup. */
export const PublicOnlyRoute = () => {
	const { isAuthenticated, isBootstrapping, user } = useAuth();

	if (isBootstrapping) return <FullPageLoader label="Loading" />;
	if (isAuthenticated) return <Navigate to={landingRouteFor(user)} replace />;

	return <Outlet />;
};

/** Restricts a branch of the app to specific account types. */
export const RoleRoute = ({ allow = [] }) => {
	const { isBootstrapping, user } = useAuth();

	if (isBootstrapping) return <FullPageLoader label="Loading" />;
	if (!user || !allow.includes(user.role)) return <Navigate to={ROUTES.dashboard} replace />;

	return <Outlet />;
};

/**
 * Guards the verification holding pages themselves.
 *
 * Without this, an approved member could sit on /awaiting-approval forever and
 * a company account could wander onto a screen that means nothing to them.
 * `allow` lists the approval statuses this route is for.
 */
export const VerificationRoute = ({ allow = [] }) => {
	const { isAuthenticated, isBootstrapping, user } = useAuth();
	const location = useLocation();

	if (isBootstrapping) return <FullPageLoader label="Loading" />;

	if (!isAuthenticated) {
		return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
	}

	// Roles that are never verified have no business here.
	if (!requiresApproval(user.role) || !allow.includes(user.approvalStatus)) {
		return <Navigate to={landingRouteFor(user)} replace />;
	}

	return <Outlet />;
};
