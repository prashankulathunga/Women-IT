import { useEffect } from 'react';

/**
 * Prevents the page behind a modal or drawer from scrolling, restoring the
 * previous overflow value (not blindly resetting it) so nested overlays work.
 */
export const useLockBodyScroll = (locked) => {
	useEffect(() => {
		if (!locked) return undefined;

		const { body } = document;
		const previous = body.style.overflow;
		body.style.overflow = 'hidden';

		return () => {
			body.style.overflow = previous;
		};
	}, [locked]);
};
