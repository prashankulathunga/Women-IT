import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Restores scroll position on navigation.
 * In-page anchors (`/#jobs`) are handled separately so landing-page links
 * still jump to their section.
 */
export const ScrollToTop = () => {
	const { pathname, hash } = useLocation();

	useEffect(() => {
		if (hash) {
			const target = document.getElementById(hash.slice(1));
			if (target) {
				target.scrollIntoView({ behavior: 'smooth', block: 'start' });
				return;
			}
		}

		window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
	}, [pathname, hash]);

	return null;
};
