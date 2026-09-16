import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { cn } from '../../lib/cn';

/**
 * Wordmark. "Aruna" means dawn — the mark is a sunrise arc over the letterform.
 */
const SIZES = {
	sm: { mark: 'h-7 w-7', text: 'text-lg', sub: 'text-[9px]' },
	md: { mark: 'h-9 w-9', text: 'text-xl', sub: 'text-[10px]' },
	lg: { mark: 'h-11 w-11', text: 'text-2xl', sub: 'text-[11px]' },
};

export const Logo = ({
	size = 'md',
	to = ROUTES.home,
	inverted = false,
	showTagline = true,
	className,
}) => {
	const scale = SIZES[size] ?? SIZES.md;

	const content = (
		<>
			<span
				className={cn(
					'flex shrink-0 items-center justify-center rounded-xl',
					inverted ? 'bg-white' : 'bg-brand-900',
					scale.mark,
				)}
			>
				<svg viewBox="0 0 24 24" fill="none" className="h-[62%] w-[62%]" aria-hidden="true">
					<path
						d="M3 18h18"
						stroke={inverted ? '#020079' : '#ffffff'}
						strokeWidth="2"
						strokeLinecap="round"
					/>
					<path
						d="M5.5 18a6.5 6.5 0 0 1 13 0"
						stroke={inverted ? '#020079' : '#ffffff'}
						strokeWidth="2"
						strokeLinecap="round"
					/>
					<circle cx="12" cy="7.5" r="1.6" fill={inverted ? '#b52a63' : '#e2709f'} />
				</svg>
			</span>

			<span className="flex flex-col leading-none">
				<span
					className={cn(
						'font-display font-semibold tracking-tight',
						inverted ? 'text-white' : 'text-brand-900',
						scale.text,
					)}
				>
					Aruna
				</span>
				{showTagline && (
					<span
						className={cn(
							'mt-0.5 font-semibold uppercase tracking-[0.18em]',
							inverted ? 'text-white/60' : 'text-ink-400',
							scale.sub,
						)}
					>
						Women in Sri Lankan IT
					</span>
				)}
			</span>
		</>
	);

	const classes = cn('inline-flex items-center gap-2.5', className);

	if (!to) return <span className={classes}>{content}</span>;

	return (
		<Link to={to} className={cn(classes, 'rounded-lg')} aria-label="Aruna — home">
			{content}
		</Link>
	);
};
