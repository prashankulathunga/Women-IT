import { useCallback, useMemo, useState } from 'react';
import { useDebouncedValue } from './useDebouncedValue';

/**
 * Filter + search + pagination state for every list screen.
 *
 * Search is debounced, changing any facet resets to page 1, and the returned
 * `query` object is shaped exactly as the service layer expects — so a list
 * page is `useFilters` + `useAsync` and nothing else.
 */
export const useFilters = (initialFilters = {}, { pageSize = 6 } = {}) => {
	const [search, setSearch] = useState('');
	const [filters, setFilters] = useState(initialFilters);
	const [page, setPage] = useState(1);

	const debouncedSearch = useDebouncedValue(search, 300);

	const setFilter = useCallback((name, value) => {
		setFilters((current) => ({ ...current, [name]: value }));
		setPage(1);
	}, []);

	const updateSearch = useCallback((value) => {
		setSearch(value);
		setPage(1);
	}, []);

	const reset = useCallback(() => {
		setSearch('');
		setFilters(initialFilters);
		setPage(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const query = useMemo(
		() => ({ ...filters, search: debouncedSearch, page, pageSize }),
		[debouncedSearch, filters, page, pageSize],
	);

	const activeCount = useMemo(
		() => Object.values(filters).filter(Boolean).length + (debouncedSearch ? 1 : 0),
		[debouncedSearch, filters],
	);

	return {
		search,
		setSearch: updateSearch,
		filters,
		setFilter,
		page,
		setPage,
		reset,
		query,
		activeCount,
	};
};
