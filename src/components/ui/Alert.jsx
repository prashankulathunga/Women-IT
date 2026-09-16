import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/** Inline message block for form-level errors, tips and confirmations. */
const TONES = {
	info: { wrap: 'bg-info-50 border-info-500/20 text-info-700', icon: 'info' },
	success: {
		wrap: 'bg-success-50 border-success-500/20 text-success-700',
		icon: 'check-circle',
	},
	warning: {
		wrap: 'bg-warning-50 border-warning-500/20 text-warning-700',
		icon: 'alert',
	},
	danger: { wrap: 'bg-danger-50 border-danger-500/20 text-danger-700', icon: 'alert' },
	brand: { wrap: 'bg-brand-50 border-brand-200 text-brand-900', icon: 'sparkle' },
};

export const Alert = ({
	tone = 'info',
	title,
	icon,
	onDismiss,
	className,
	children,
}) => {
	const config = TONES[tone] ?? TONES.info;

	return (
		<div
			role={tone === 'danger' ? 'alert' : 'status'}
			className={cn(
				'flex items-start gap-3 rounded-field border px-4 py-3',
				config.wrap,
				className,
			)}
		>
			<Icon name={icon ?? config.icon} className="mt-0.5" />

			<div className="min-w-0 flex-1 text-[13px] leading-relaxed">
				{title && <p className="font-semibold">{title}</p>}
				{children && <div className={cn(title && 'mt-0.5 opacity-90')}>{children}</div>}
			</div>

			{onDismiss && (
				<button
					type="button"
					onClick={onDismiss}
					aria-label="Dismiss"
					className="-mr-1 -mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md opacity-60 transition-opacity hover:opacity-100"
				>
					<Icon name="close" size="xs" />
				</button>
			)}
		</div>
	);
};
