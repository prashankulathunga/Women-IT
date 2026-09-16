import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/**
 * Large radio-style selection card — used for account-type selection on
 * signup and for single-choice steps in onboarding.
 */
export const OptionCard = ({
	name,
	value,
	checked = false,
	onChange,
	icon,
	title,
	description,
	className,
}) => (
	<label
		className={cn(
			'group relative flex cursor-pointer gap-3.5 rounded-card border p-4 transition-all duration-150',
			checked
				? 'border-brand-900 bg-brand-50/60 shadow-subtle'
				: 'border-line-strong bg-white hover:border-ink-400 hover:bg-ink-50/40',
			className,
		)}
	>
		<input
			type="radio"
			name={name}
			value={value}
			checked={checked}
			onChange={() => onChange?.(value)}
			className="sr-only"
		/>

		{icon && (
			<span
				className={cn(
					'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
					checked ? 'bg-brand-900 text-white' : 'bg-ink-100 text-ink-500',
				)}
			>
				<Icon name={icon} size="md" />
			</span>
		)}

		<div className="min-w-0 flex-1">
			<p
				className={cn(
					'text-sm font-semibold',
					checked ? 'text-brand-900' : 'text-ink-900',
				)}
			>
				{title}
			</p>
			{description && (
				<p className="mt-0.5 text-xs leading-relaxed text-ink-500">{description}</p>
			)}
		</div>

		<span
			aria-hidden="true"
			className={cn(
				'mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors',
				checked ? 'border-brand-900 bg-brand-900' : 'border-line-strong bg-white',
			)}
		>
			{checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
		</span>
	</label>
);
