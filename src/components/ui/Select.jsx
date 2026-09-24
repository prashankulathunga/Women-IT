import { useId } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';
import { controlClasses, describedBy } from './controlStyles';
import { Field } from './Field';

/**
 * Native select, restyled.
 * Native is deliberate: it gives correct mobile behaviour and keyboard
 * semantics for free, which a custom listbox would have to re-earn.
 */
export const Select = ({
	id: idProp,
	label,
	hint,
	error,
	required,
	optional,
	options = [],
	placeholder = 'Select an option',
	allowEmpty = true,
	className,
	containerClassName,
	size = 'md',
	...props
}) => {
	const generatedId = useId();
	const id = idProp ?? `select-${generatedId}`;

	return (
		<Field
			id={id}
			label={label}
			hint={hint}
			error={error}
			required={required}
			optional={optional}
			className={containerClassName}
		>
			<div className="relative">
				<select
					id={id}
					aria-invalid={error ? true : undefined}
					aria-describedby={describedBy(id, error, hint)}
					className={controlClasses(
						Boolean(error),
						cn(
							'cursor-pointer appearance-none pl-3.5 pr-10',
							size === 'sm' ? 'h-9 text-[13px]' : 'h-11',
							className,
						),
					)}
					{...props}
				>
					{allowEmpty && <option value="">{placeholder}</option>}
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>

				<Icon
					name="chevron-down"
					className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400"
				/>
			</div>
		</Field>
	);
};
