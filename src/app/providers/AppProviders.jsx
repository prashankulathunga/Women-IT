import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { AuthProvider } from './AuthProvider';
import { ToastProvider } from './ToastProvider';

/**
 * Composition root.
 *
 * Order matters: the error boundary wraps everything, the router sits above
 * anything that navigates, and toasts sit above auth so auth flows can
 * notify.
 */
export const AppProviders = ({ children }) => (
	<ErrorBoundary>
		<BrowserRouter>
			<ToastProvider>
				<AuthProvider>{children}</AuthProvider>
			</ToastProvider>
		</BrowserRouter>
	</ErrorBoundary>
);
