import { Outlet } from 'react-router-dom';
import { MarketingFooter } from './partials/MarketingFooter';
import { MarketingHeader } from './partials/MarketingHeader';

/** Shell for the marketing surface: landing page, about, legal. */
export const PublicLayout = () => (
	<div className="flex min-h-screen flex-col bg-canvas">
		<MarketingHeader />
		<main className="flex-1">
			<Outlet />
		</main>
		<MarketingFooter />
	</div>
);
