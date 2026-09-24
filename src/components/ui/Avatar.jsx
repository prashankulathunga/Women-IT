import { useState } from 'react';
import { cn } from '../../lib/cn';
import { initialsOf } from '../../lib/format';

/**
 * Avatar with a deterministic initials fallback.
 * The colour is derived from the name so the same person is always the same
 * colour, and a broken image URL degrades to initials rather than a grey box.
 */
const SIZES = {
	xs: 'h-6 w-6 text-[10px]',
	sm: 'h-8 w-8 text-xs',
	md: 'h-10 w-10 text-sm',
	lg: 'h-12 w-12 text-base',
	xl: 'h-16 w-16 text-xl',
	'2xl': 'h-20 w-20 text-2xl',
};

const PALETTE = [
	'bg-brand-100 text-brand-900',
	'bg-plum-100 text-plum-800',
	'bg-info-50 text-info-700',
	'bg-success-50 text-success-700',
	'bg-warning-50 text-warning-700',
	'bg-ink-200 text-ink-800',
];

const paletteFor = (name = '') => {
	let sum = 0;
	for (let index = 0; index < name.length; index += 1) sum += name.charCodeAt(index);
	return PALETTE[sum % PALETTE.length];
};

export const Avatar = ({ name = '', src, size = 'md', ring = false, className }) => {
	const [hasFailed, setHasFailed] = useState(false);
	const showImage = Boolean(src) && !hasFailed;

	return (
		<span
			className={cn(
				'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold select-none',
				SIZES[size] ?? SIZES.md,
				!showImage && paletteFor(name),
				ring && 'ring-2 ring-white outline outline-line',
				className,
			)}
		>
			{showImage ? (
				<img
					src={src}
					alt={name}
					onError={() => setHasFailed(true)}
					className="h-full w-full object-cover"
				/>
			) : (
				<span aria-hidden="true">{initialsOf(name)}</span>
			)}
		</span>
	);
};
