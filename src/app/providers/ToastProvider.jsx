import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../components/icons/Icon';
import { cn } from '../../lib/cn';
import { ToastContext } from './ToastContext';

/**
 * Application-wide notification surface.
 *
 * Mutations across the app (apply, register, request, save) confirm through
 * `toast.success(...)` so feedback is consistent and never blocks the page.
 */
const TONES = {
	success: { wrap: 'border-success-500/25 bg-white', icon: 'check-circle', accent: 'text-success-700' },
	error: { wrap: 'border-danger-500/25 bg-white', icon: 'alert', accent: 'text-danger-500' },
	info: { wrap: 'border-info-500/25 bg-white', icon: 'info', accent: 'text-info-700' },
	brand: { wrap: 'border-brand-200 bg-white', icon: 'sparkle', accent: 'text-brand-800' },
};

const DURATION = 4200;

export const ToastProvider = ({ children }) => {
	const [toasts, setToasts] = useState([]);
	const timersRef = useRef(new Map());

	const dismiss = useCallback((id) => {
		setToasts((current) => current.filter((toast) => toast.id !== id));
		const timer = timersRef.current.get(id);
		if (timer) {
			clearTimeout(timer);
			timersRef.current.delete(id);
		}
	}, []);

	const push = useCallback(
		(toast) => {
			const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
			setToasts((current) => [...current.slice(-2), { ...toast, id }]);
			timersRef.current.set(
				id,
				setTimeout(() => dismiss(id), toast.duration ?? DURATION),
			);
			return id;
		},
		[dismiss],
	);

	useEffect(() => {
		const timers = timersRef.current;
		return () => {
			timers.forEach((timer) => clearTimeout(timer));
			timers.clear();
		};
	}, []);

	const value = useMemo(
		() => ({
			toasts,
			push,
			dismiss,
			success: (message, title) => push({ tone: 'success', message, title }),
			error: (message, title) => push({ tone: 'error', message, title }),
			info: (message, title) => push({ tone: 'info', message, title }),
		}),
		[dismiss, push, toasts],
	);

	return (
		<ToastContext.Provider value={value}>
			{children}
			{createPortal(
				<div
					aria-live="polite"
					aria-atomic="false"
					className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:top-0 sm:items-end sm:p-6"
				>
					{toasts.map((toast) => {
						const config = TONES[toast.tone] ?? TONES.info;

						return (
							<div
								key={toast.id}
								role="status"
								className={cn(
									'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-field border px-4 py-3 shadow-elevated animate-rise',
									config.wrap,
								)}
							>
								<Icon
									name={config.icon}
									className={cn('mt-0.5', config.accent)}
								/>

								<div className="min-w-0 flex-1">
									{toast.title && (
										<p className="text-[13px] font-semibold text-ink-900">
											{toast.title}
										</p>
									)}
									<p
										className={cn(
											'text-[13px] leading-relaxed text-ink-600',
											toast.title && 'mt-0.5',
										)}
									>
										{toast.message}
									</p>
								</div>

								<button
									type="button"
									onClick={() => dismiss(toast.id)}
									aria-label="Dismiss notification"
									className="-mr-1 -mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
								>
									<Icon name="close" size="xs" />
								</button>
							</div>
						);
					})}
				</div>,
				document.body,
			)}
		</ToastContext.Provider>
	);
};
