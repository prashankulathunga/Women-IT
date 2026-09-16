import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/**
 * Accessible dialog: portalled, scroll-locked, Escape-closable and
 * focus-trapped within the panel.
 */
const SIZES = {
	sm: 'max-w-md',
	md: 'max-w-lg',
	lg: 'max-w-2xl',
	xl: 'max-w-4xl',
};

const FOCUSABLE =
	'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Modal = ({
	isOpen,
	onClose,
	title,
	description,
	size = 'md',
	footer,
	closeOnOverlayClick = true,
	children,
}) => {
	const panelRef = useRef(null);
	const restoreFocusRef = useRef(null);

	useLockBodyScroll(isOpen);

	const handleKeyDown = useCallback(
		(event) => {
			if (event.key === 'Escape') {
				event.stopPropagation();
				onClose?.();
				return;
			}

			if (event.key !== 'Tab' || !panelRef.current) return;

			const focusable = Array.from(panelRef.current.querySelectorAll(FOCUSABLE)).filter(
				(node) => node.offsetParent !== null,
			);
			if (focusable.length === 0) return;

			const first = focusable[0];
			const last = focusable[focusable.length - 1];

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		},
		[onClose],
	);

	useEffect(() => {
		if (!isOpen) return undefined;

		restoreFocusRef.current = document.activeElement;
		const timer = setTimeout(() => {
			const target = panelRef.current?.querySelector(FOCUSABLE);
			(target ?? panelRef.current)?.focus();
		}, 0);

		return () => {
			clearTimeout(timer);
			restoreFocusRef.current?.focus?.();
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return createPortal(
		<div
			className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-6"
			role="presentation"
			onKeyDown={handleKeyDown}
		>
			<div
				className="fixed inset-0 bg-ink-950/45 backdrop-blur-[2px] animate-fade-in"
				onClick={closeOnOverlayClick ? onClose : undefined}
				aria-hidden="true"
			/>

			<div
				ref={panelRef}
				role="dialog"
				aria-modal="true"
				aria-label={title}
				tabIndex={-1}
				className={cn(
					'relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden bg-white shadow-elevated outline-none animate-rise',
					'rounded-t-panel sm:rounded-panel',
					SIZES[size] ?? SIZES.md,
				)}
			>
				<div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
					<div className="min-w-0">
						<h2 className="font-display text-xl font-semibold tracking-tight text-ink-900">
							{title}
						</h2>
						{description && (
							<p className="mt-1 text-[13px] leading-relaxed text-ink-500">
								{description}
							</p>
						)}
					</div>

					<button
						type="button"
						onClick={onClose}
						aria-label="Close dialog"
						className="-mr-1.5 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-800"
					>
						<Icon name="close" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

				{footer && (
					<div className="flex flex-col-reverse gap-3 border-t border-line bg-surface-muted/60 px-6 py-4 sm:flex-row sm:justify-end">
						{footer}
					</div>
				)}
			</div>
		</div>,
		document.body,
	);
};
