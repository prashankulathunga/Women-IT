import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/**
 * Label + hint + error shell shared by every form control.
 * Owning this here keeps error copy, spacing and `aria-describedby` wiring
 * identical across the whole product.
 */
export const Field = ({
	id,
	label,
	hint,
	error,
	required = false,
	optional = false,
	className,
	labelAddon,
	children,
}) => (
	<div className={cn('w-full', className)}>
		{label && (
			<div className="mb-1.5 flex items-baseline justify-between gap-3">
				<label htmlFor={id} className="text-[13px] font-semibold text-ink-800">
					{label}
					{required && (
						<span className="ml-0.5 text-plum-600" aria-hidden="true">
							*
						</span>
					)}
					{optional && (
						<span className="ml-1.5 text-xs font-normal text-ink-400">Optional</span>
					)}
				</label>
				{labelAddon}
			</div>
		)}

		{children}

		{error ? (
			<p
				id={`${id}-error`}
				role="alert"
				className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-danger-500"
			>
				<Icon name="alert" size="xs" className="mt-px" />
				{error}
			</p>
		) : hint ? (
			<p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-400">
				{hint}
			</p>
		) : null}
	</div>
);
