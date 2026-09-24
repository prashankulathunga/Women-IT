import { useContext } from 'react';
import { ToastContext } from '../app/providers/ToastContext';

/** Access the global notification queue. */
export const useToast = () => {
	const context = useContext(ToastContext);

	if (!context) {
		throw new Error('useToast must be used inside <ToastProvider>.');
	}

	return context;
};
