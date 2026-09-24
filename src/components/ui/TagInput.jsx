import { useId, useMemo, useState } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';
import { Field } from './Field';

/**
 * Free-text tag entry with typeahead suggestions — used for skills on the
 * member, mentor and company profiles.
 *
 * Fully keyboard-driven: Enter or comma commits, Backspace on an empty input
 * removes the last tag, Escape dismisses the suggestion list.
 */
export const TagInput = ({
	id: idProp,
	label,
	hint,
	error,
	required,
	optional,
	value = [],
	onChange,
	suggestions = [],
	placeholder = 'Type and press Enter',
	max = 12,
}) => {
	const generatedId = useId();
	const id = idProp ?? `tags-${generatedId}`;
	const [draft, setDraft] = useState('');
	const [isFocused, setIsFocused] = useState(false);

	const available = useMemo(() => {
		const needle = draft.trim().toLowerCase();
		return suggestions
			.filter((item) => !value.includes(item))
			.filter((item) => (needle ? item.toLowerCase().includes(needle) : true))
			.slice(0, 6);
	}, [draft, suggestions, value]);

	const addTag = (raw) => {
		const tag = raw.trim().replace(/,$/, '');
		if (!tag || value.length >= max) return;
		if (value.some((item) => item.toLowerCase() === tag.toLowerCase())) {
			setDraft('');
			return;
		}
		onChange?.([...value, tag]);
		setDraft('');
	};

	const removeTag = (tag) => onChange?.(value.filter((item) => item !== tag));

	const handleKeyDown = (event) => {
		if (event.key === 'Enter' || event.key === ',') {
			event.preventDefault();
			addTag(draft);
			return;
		}

		if (event.key === 'Backspace' && !draft && value.length > 0) {
			removeTag(value[value.length - 1]);
			return;
		}

		if (event.key === 'Escape') setIsFocused(false);
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
				<span className="text-xs tabular-nums text-ink-400">
					{value.length}/{max}
				</span>
			}
		>
			<div
				className={cn(
					'flex min-h-11 w-full flex-wrap items-center gap-1.5 rounded-field border bg-white px-2 py-1.5 transition-colors',
					error
						? 'border-danger-500'
						: isFocused
							? 'border-brand-600 ring-4 ring-brand-600/12'
							: 'border-line-strong hover:border-ink-300',
				)}
			>
				{value.map((tag) => (
					<span
						key={tag}
						className="inline-flex h-7 items-center gap-1 rounded-md bg-brand-50 pl-2.5 pr-1 text-xs font-semibold text-brand-900"
					>
						{tag}
						<button
							type="button"
							onClick={() => removeTag(tag)}
							aria-label={`Remove ${tag}`}
							className="flex h-5 w-5 items-center justify-center rounded text-brand-700/70 transition-colors hover:bg-brand-200 hover:text-brand-900"
						>
							<Icon name="close" size="xs" strokeWidth={2.5} />
						</button>
					</span>
				))}

				<input
					id={id}
					type="text"
					value={draft}
					disabled={value.length >= max}
					onChange={(event) => setDraft(event.target.value)}
					onKeyDown={handleKeyDown}
					onFocus={() => setIsFocused(true)}
					onBlur={() => {
						// Let a suggestion click register before the list unmounts.
						setTimeout(() => setIsFocused(false), 120);
						addTag(draft);
					}}
					placeholder={value.length >= max ? `Maximum ${max} reached` : placeholder}
					aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
					className="h-8 min-w-[9rem] flex-1 bg-transparent px-1.5 text-sm text-ink-900 placeholder:text-ink-400 outline-none disabled:cursor-not-allowed"
				/>
			</div>

			{isFocused && available.length > 0 && (
				<div className="mt-2 flex flex-wrap gap-1.5">
					{available.map((suggestion) => (
						<button
							key={suggestion}
							type="button"
							onMouseDown={(event) => event.preventDefault()}
							onClick={() => addTag(suggestion)}
							className="inline-flex h-7 items-center gap-1 rounded-md border border-line-strong bg-white px-2.5 text-xs font-medium text-ink-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-900"
						>
							<Icon name="plus" size="xs" />
							{suggestion}
						</button>
					))}
				</div>
			)}
		</Field>
	);
};
