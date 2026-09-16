import { useId, useState } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';
import { controlClasses, describedBy } from './controlStyles';
import { Field } from './Field';

/**
 * Text input with optional leading icon, trailing adornment and a built-in
 * password reveal toggle.
 */
export const Input = ({
	id: idProp,
	label,
	hint,
	error,
	required,
	optional,
	leadingIcon,
	trailingAddon,
	type = 'text',
	className,
	containerClassName,
	labelAddon,
	...props
}) => {
	const generatedId = useId();
	const id = idProp ?? `input-${generatedId}`;
	const [isRevealed, setIsRevealed] = useState(false);

	const isPassword = type === 'password';
	const resolvedType = isPassword && isRevealed ? 'text' : type;
	const hasTrailing = isPassword || Boolean(trailingAddon);

	return (
		<Field
			id={id}
			label={label}
			hint={hint}
			error={error}
			required={required}
			optional={optional}
			labelAddon={labelAddon}
			className={containerClassName}
		>
			<div className="relative">
				{leadingIcon && (
					<Icon
						name={leadingIcon}
						className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
					/>
				)}

				<input
					id={id}
					type={resolvedType}
					aria-invalid={error ? true : undefined}
					aria-describedby={describedBy(id, error, hint)}
					className={controlClasses(
						Boolean(error),
						cn(
							'h-11 px-3.5',
							leadingIcon && 'pl-10',
							hasTrailing && 'pr-11',
							className,
						),
					)}
					{...props}
				/>

				{isPassword ? (
					<button
						type="button"
						onClick={() => setIsRevealed((value) => !value)}
						aria-label={isRevealed ? 'Hide password' : 'Show password'}
						className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
					>
						<Icon name={isRevealed ? 'eye-off' : 'eye'} />
					</button>
				) : (
					trailingAddon && (
						<div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-ink-400">
							{trailingAddon}
						</div>
					)
				)}
			</div>
		</Field>
	);
};
