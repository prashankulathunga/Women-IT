import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Declarative data-fetching hook for the service layer.
 *
 * Handles the four states every list/detail screen needs (idle, loading,
 * error, success), ignores responses from superseded requests, and never
 * sets state after unmount.
 *
 * @param {Function} asyncFn           async function returning the data
 * @param {Array}    deps              re-runs when these change
 * @param {object}   [options]
 * @param {boolean}  [options.immediate=true]
 * @param {*}        [options.initialData=null]
 */
export const useAsync = (asyncFn, deps = [], options = {}) => {
	const { immediate = true, initialData = null } = options;

	const [data, setData] = useState(initialData);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(immediate);

	// Callers pass inline arrows, so the latest function is mirrored into a ref
	// (in an effect, never during render) and `run` stays referentially stable.
	const fnRef = useRef(asyncFn);
	const mountedRef = useRef(true);
	const requestIdRef = useRef(0);

	useEffect(() => {
		fnRef.current = asyncFn;
	});

	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const run = useCallback(async (...args) => {
		const requestId = ++requestIdRef.current;
		setIsLoading(true);
		setError(null);

		try {
			const result = await fnRef.current(...args);
			if (mountedRef.current && requestId === requestIdRef.current) {
				setData(result);
			}
			return result;
		} catch (caught) {
			if (mountedRef.current && requestId === requestIdRef.current) {
				setError(caught?.message || 'Unable to load this content right now.');
			}
			return undefined;
		} finally {
			if (mountedRef.current && requestId === requestIdRef.current) {
				setIsLoading(false);
			}
		}
	}, []);

	useEffect(() => {
		// This is the fetch boundary: kicking off a request necessarily flips the
		// hook into its loading state. The synchronous `setIsLoading(true)` inside
		// `run` is the intended behaviour here, not a cascading render.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		if (immediate) run();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	return { data, error, isLoading, run, refetch: run, setData };
};
