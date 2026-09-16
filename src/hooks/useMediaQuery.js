import { useCallback, useSyncExternalStore } from 'react';

/**
 * Media query subscription.
 *
 * Built on `useSyncExternalStore` rather than `useState` + `useEffect`: the
 * browser's match state is external, so this is the API designed for it — it
 * stays correct across concurrent renders and needs no synchronisation effect.
 */
export const useMediaQuery = (query) => {
	const subscribe = useCallback(
		(onStoreChange) => {
			if (typeof window === 'undefined' || !window.matchMedia) return () => {};

			const mediaQuery = window.matchMedia(query);
			mediaQuery.addEventListener('change', onStoreChange);
			return () => mediaQuery.removeEventListener('change', onStoreChange);
		},
		[query],
	);

	const getSnapshot = useCallback(() => {
		if (typeof window === 'undefined' || !window.matchMedia) return false;
		return window.matchMedia(query).matches;
	}, [query]);

	return useSyncExternalStore(subscribe, getSnapshot, () => false);
};

export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
