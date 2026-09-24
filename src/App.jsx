import { Route, Routes } from 'react-router-dom';
import { ScrollToTop } from './app/router/ScrollToTop';
import {
	ProtectedRoute,
	PublicOnlyRoute,
	RoleRoute,
} from './app/router/RouteGuards';
import { ROLES } from './constants/roles';
import { ROUTES } from './constants/routes';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PublicLayout } from './layouts/PublicLayout';

import { LandingPage } from './pages/public/LandingPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

import { LoginPage } from './pages/auth/LoginPage';
import { OnboardingPage } from './pages/auth/OnboardingPage';
import { SignupPage } from './pages/auth/SignupPage';

import { ApplicationsPage } from './pages/app/ApplicationsPage';
import { BlogDetailPage } from './pages/app/BlogDetailPage';
import { BlogsPage } from './pages/app/BlogsPage';
import { CompanyApplicantsPage } from './pages/app/CompanyApplicantsPage';
import { CompanyPostingsPage } from './pages/app/CompanyPostingsPage';
import { DashboardPage } from './pages/app/DashboardPage';
import { JobDetailPage } from './pages/app/JobDetailPage';
import { JobsPage } from './pages/app/JobsPage';
import { MentorDetailPage } from './pages/app/MentorDetailPage';
import { MentorsPage } from './pages/app/MentorsPage';
import { MentorshipPage } from './pages/app/MentorshipPage';
import { ProfilePage } from './pages/app/ProfilePage';
import { SettingsPage } from './pages/app/SettingsPage';
import { WorkshopsPage } from './pages/app/WorkshopsPage';

/**
 * Route tree.
 *
 * Three shells: the public marketing site, the auth split-screen, and the
 * authenticated dashboard. Access is enforced by the guards rather than by
 * individual pages, and role-restricted branches sit behind <RoleRoute>.
 */
function App() {
	return (
		<>
			<ScrollToTop />

			<Routes>
				{/* Marketing */}
				<Route element={<PublicLayout />}>
					<Route index path={ROUTES.home} element={<LandingPage />} />
				</Route>

				{/* Authentication — signed-in users are redirected away */}
				<Route element={<PublicOnlyRoute />}>
					<Route element={<AuthLayout />}>
						<Route path={ROUTES.login} element={<LoginPage />} />
						<Route path={ROUTES.signup} element={<SignupPage />} />
					</Route>
				</Route>

				{/* Profile capture — requires a session but not a finished profile */}
				<Route element={<ProtectedRoute requireOnboarding={false} />}>
					<Route path={ROUTES.onboarding} element={<OnboardingPage />} />
				</Route>

				{/* Application */}
				<Route element={<ProtectedRoute />}>
					<Route element={<DashboardLayout />}>
						<Route path={ROUTES.dashboard} element={<DashboardPage />} />
						<Route path={ROUTES.profile} element={<ProfilePage />} />
						<Route path={ROUTES.settings} element={<SettingsPage />} />

						<Route path={ROUTES.jobs} element={<JobsPage />} />
						<Route path={ROUTES.jobDetail()} element={<JobDetailPage />} />

						<Route path={ROUTES.blogs} element={<BlogsPage />} />
						<Route path={ROUTES.blogDetail()} element={<BlogDetailPage />} />
						<Route path={ROUTES.workshops} element={<WorkshopsPage />} />

						<Route path={ROUTES.mentorRequests} element={<MentorshipPage />} />

						{/* Members only */}
						<Route element={<RoleRoute allow={[ROLES.MEMBER]} />}>
							<Route path={ROUTES.applications} element={<ApplicationsPage />} />
							<Route path={ROUTES.mentors} element={<MentorsPage />} />
							<Route path={ROUTES.mentorDetail()} element={<MentorDetailPage />} />
						</Route>

						{/* Employer partners only */}
						<Route element={<RoleRoute allow={[ROLES.COMPANY]} />}>
							<Route path={ROUTES.companyPostings} element={<CompanyPostingsPage />} />
							<Route
								path={ROUTES.companyApplicants}
								element={<CompanyApplicantsPage />}
							/>
						</Route>
					</Route>
				</Route>

				{/* Fallback */}
				<Route element={<PublicLayout />}>
					<Route path={ROUTES.notFound} element={<NotFoundPage />} />
				</Route>
			</Routes>
		</>
	);
}

export default App;
