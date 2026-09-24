import { useEffect, useState } from 'react';

/** Delays propagation of a fast-changing value (search inputs, filters). */
export const useDebouncedValue = (value, delay = 300) => {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(timer);
	}, [value, delay]);

	return debounced;
};
