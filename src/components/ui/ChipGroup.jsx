import { useId } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';
import { Field } from './Field';

/**
 * Multi-select chip list for closed vocabularies (mentorship goals, hiring
 * focus). Implemented as a group of toggle buttons with `aria-pressed`, which
 * gives correct semantics without a custom listbox.
 */
export const ChipGroup = ({
	id: idProp,
	label,
	hint,
	error,
	required,
	optional,
	options = [],
	value = [],
	onChange,
	max,
}) => {
	const generatedId = useId();
	const id = idProp ?? `chips-${generatedId}`;

	const toggle = (optionValue) => {
		if (value.includes(optionValue)) {
			onChange?.(value.filter((item) => item !== optionValue));
			return;
		}
		if (max && value.length >= max) return;
		onChange?.([...value, optionValue]);
	};

	return (
		<Field
			id={id}
			label={label}
			hint={hint}
			error={error}
			required={required}
			optional={optional}
			labelAddon={
				max ? (
					<span className="text-xs tabular-nums text-ink-400">
						{value.length}/{max}
					</span>
				) : null
			}
		>
			<div className="flex flex-wrap gap-2" role="group" aria-labelledby={id}>
				{options.map((option) => {
					const isSelected = value.includes(option.value);
					const isBlocked = !isSelected && max && value.length >= max;

					return (
						<button
							key={option.value}
							type="button"
							aria-pressed={isSelected}
							disabled={Boolean(isBlocked)}
							onClick={() => toggle(option.value)}
							className={cn(
								'inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-all duration-150',
								isSelected
									? 'border-brand-900 bg-brand-900 text-white'
									: 'border-line-strong bg-white text-ink-600 hover:border-ink-400 hover:text-ink-900',
								isBlocked && 'cursor-not-allowed opacity-45 hover:border-line-strong',
							)}
						>
							{isSelected && <Icon name="check" size="xs" strokeWidth={2.5} />}
							{option.label}
						</button>
					);
				})}
			</div>
		</Field>
	);
};
