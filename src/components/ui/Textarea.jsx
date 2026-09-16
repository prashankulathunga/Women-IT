import { useId } from 'react';
import { cn } from '../../lib/cn';
import { controlClasses, describedBy } from './controlStyles';
import { Field } from './Field';

/** Multi-line input with an optional live character counter. */
export const Textarea = ({
	id: idProp,
	label,
	hint,
	error,
	required,
	optional,
	rows = 4,
	maxLength,
	showCount = false,
	value = '',
	className,
	containerClassName,
	...props
}) => {
	const generatedId = useId();
	const id = idProp ?? `textarea-${generatedId}`;

	return (
		<Field
			id={id}
			label={label}
			hint={hint}
			error={error}
			required={required}
			optional={optional}
			className={containerClassName}
			labelAddon={
				showCount && maxLength ? (
					<span
						className={cn(
							'text-xs tabular-nums',
							value.length > maxLength * 0.9 ? 'text-plum-600' : 'text-ink-400',
						)}
					>
						{value.length}/{maxLength}
					</span>
				) : null
			}
		>
			<textarea
				id={id}
				rows={rows}
				maxLength={maxLength}
				value={value}
				aria-invalid={error ? true : undefined}
				aria-describedby={describedBy(id, error, hint)}
				className={controlClasses(
					Boolean(error),
					cn('resize-y px-3.5 py-2.5 leading-relaxed', className),
				)}
				{...props}
			/>
		</Field>
	);
};
