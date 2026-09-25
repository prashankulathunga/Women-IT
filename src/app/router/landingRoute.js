import { APPROVAL_STATUS } from '../../constants/options';
import { requiresApproval } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';

/**
 * Where a signed-in user belongs right now.
 *
 * One function, used by the guards, by login and by signup, so every entry
 * point into the app agrees on the order of the gates:
 *
 *   verification → onboarding → dashboard
 *
 * Verification comes first deliberately: an unapproved member should not be
 * asked to fill in a profile we may never activate.
 */
export const landingRouteFor = (user) => {
	if (!user) return ROUTES.login;

	if (requiresApproval(user.role)) {
		if (user.approvalStatus === APPROVAL_STATUS.PENDING) return ROUTES.awaitingApproval;
		if (user.approvalStatus === APPROVAL_STATUS.DECLINED) return ROUTES.accountDeclined;
	}

	if (!user.onboardingComplete) return ROUTES.onboarding;

	return ROUTES.dashboard;
};

/** True when this user is cleared to use the product itself. */
export const canAccessApp = (user) =>
	Boolean(user) &&
	(!requiresApproval(user.role) || user.approvalStatus === APPROVAL_STATUS.APPROVED);
