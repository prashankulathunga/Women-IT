import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { FullPageLoader } from '../../components/common/FullPageLoader';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

/**
 * Route guards.
 *
 * All three wait for `isBootstrapping` to settle so a signed-in user is never
 * bounced to /login while the persisted session is still resolving.
 */

/** Requires a session; sends the user to login and remembers where they were. */
export const ProtectedRoute = ({ requireOnboarding = true }) => {
	const { isAuthenticated, isBootstrapping, user } = useAuth();
	const location = useLocation();

	if (isBootstrapping) return <FullPageLoader label="Checking your session" />;

	if (!isAuthenticated) {
		return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
	}

	if (requireOnboarding && !user.onboardingComplete) {
		return <Navigate to={ROUTES.onboarding} replace />;
	}

	return <Outlet />;
};

/** Keeps signed-in users away from login/signup. */
export const PublicOnlyRoute = () => {
	const { isAuthenticated, isBootstrapping, user } = useAuth();

	if (isBootstrapping) return <FullPageLoader label="Loading" />;

	if (isAuthenticated) {
		return (
			<Navigate to={user.onboardingComplete ? ROUTES.dashboard : ROUTES.onboarding} replace />
		);
	}

	return <Outlet />;
};

/** Restricts a branch of the app to specific account types. */
export const RoleRoute = ({ allow = [] }) => {
	const { isBootstrapping, user } = useAuth();

	if (isBootstrapping) return <FullPageLoader label="Loading" />;

	if (!user || !allow.includes(user.role)) {
		return <Navigate to={ROUTES.dashboard} replace />;
	}

	return <Outlet />;
};
