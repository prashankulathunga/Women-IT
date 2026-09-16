import { useContext } from 'react';
import { AuthContext } from '../app/providers/AuthContext';

/** Access the signed-in user and the auth actions. */
export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used inside <AuthProvider>.');
	}

	return context;
};
