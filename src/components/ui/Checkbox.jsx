import { useId } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/** Checkbox with a real input underneath for keyboard and form semantics. */
export const Checkbox = ({
	id: idProp,
	label,
	description,
	error,
	checked = false,
	className,
	...props
}) => {
	const generatedId = useId();
	const id = idProp ?? `checkbox-${generatedId}`;

	return (
		<div className={cn('w-full', className)}>
			<div className="flex items-start gap-3">
				<span className="relative mt-0.5 flex h-[18px] w-[18px] shrink-0">
					<input
						id={id}
						type="checkbox"
						checked={checked}
						aria-invalid={error ? true : undefined}
						className="peer h-[18px] w-[18px] cursor-pointer appearance-none rounded-[5px] border border-line-strong bg-white transition-colors checked:border-brand-900 checked:bg-brand-900 hover:border-ink-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
						{...props}
					/>
					<Icon
						name="check"
						strokeWidth={3}
						className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
					/>
				</span>

				<div className="min-w-0 flex-1">
					<label
						htmlFor={id}
						className="cursor-pointer text-[13px] leading-snug font-medium text-ink-800"
					>
						{label}
					</label>
					{description && (
						<p className="mt-0.5 text-xs leading-relaxed text-ink-500">{description}</p>
					)}
				</div>
			</div>

			{error && (
				<p role="alert" className="mt-1.5 text-xs font-medium text-danger-500">
					{error}
				</p>
			)}
		</div>
	);
};
