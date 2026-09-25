import { useEffect, useRef } from 'react';
import { readApprovalStatus, USERS_STORAGE_KEY } from '../services/userStore';

/**
 * Watches the signed-in user's approval status and fires `onChange` the moment
 * an admin decides, with no page refresh and no backend.
 *
 * Two mechanisms, deliberately overlapping — read this before changing it:
 *
 * 1. The native `storage` event. The browser fires it in every *other* tab of
 *    the same origin when localStorage is written. So when an admin approves
 *    in their tab, the member's waiting tab hears about it immediately. The
 *    catch, and it is the whole reason for mechanism 2: the event does NOT
 *    fire in the tab that performed the write. A single tab watching itself
 *    will never hear anything.
 *
 * 2. A 4-second poll. This covers the cases the event cannot: admin and member
 *    signed in from the same tab while testing, separate browser windows on
 *    some engines, and environments where the event is throttled or dropped.
 *    It is cheap — one small localStorage read — and only runs while a user is
 *    actually sitting on the awaiting-approval screen.
 *
 * Both are torn down on unmount, and the last-seen status is tracked in a ref
 * so `onChange` fires once per real transition rather than on every tick.
 *
 * @param {string|null} userId        account to watch; pass null to disable
 * @param {string|null} currentStatus status as the caller currently sees it
 * @param {(status: string) => void} onChange called with the new status
 * @param {{ pollMs?: number }} [options]
 */
export const useApprovalWatch = (userId, currentStatus, onChange, options = {}) => {
	const { pollMs = 4000 } = options;

	const onChangeRef = useRef(onChange);
	const lastSeenRef = useRef(currentStatus);

	// Keep the callback fresh without making it a dependency of the watcher,
	// so re-rendering the page never tears down and rebuilds the listeners.
	useEffect(() => {
		onChangeRef.current = onChange;
	});

	useEffect(() => {
		lastSeenRef.current = currentStatus;
	}, [currentStatus]);

	useEffect(() => {
		if (!userId) return undefined;

		let isActive = true;

		const check = () => {
			if (!isActive) return;

			const next = readApprovalStatus(userId);
			if (next && next !== lastSeenRef.current) {
				lastSeenRef.current = next;
				onChangeRef.current?.(next);
			}
		};

		const handleStorage = (event) => {
			// `key` is null when the whole store is cleared — treat that as a hit.
			if (event.key && event.key !== USERS_STORAGE_KEY) return;
			check();
		};

		window.addEventListener('storage', handleStorage);
		const timer = setInterval(check, pollMs);

		// Catch a decision that landed while this tab was backgrounded.
		const handleVisibility = () => {
			if (document.visibilityState === 'visible') check();
		};
		document.addEventListener('visibilitychange', handleVisibility);

		return () => {
			isActive = false;
			window.removeEventListener('storage', handleStorage);
			document.removeEventListener('visibilitychange', handleVisibility);
			clearInterval(timer);
		};
	}, [userId, pollMs]);
};
