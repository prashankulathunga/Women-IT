import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/**
 * The single button in the system.
 *
 * Renders as `<button>`, `<a>` or react-router `<Link>` depending on the
 * props passed, so every clickable affordance shares one focus ring, one
 * disabled treatment and one loading state.
 */
const BASE =
	'relative inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap transition-all duration-150 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:pointer-events-none disabled:opacity-55';

const VARIANTS = {
	primary:
		'bg-brand-900 text-white shadow-subtle hover:bg-brand-800 hover:shadow-brand active:bg-brand-950',
	secondary:
		'bg-white text-ink-900 ring-1 ring-inset ring-line-strong hover:bg-ink-50 active:bg-ink-100',
	accent:
		'bg-plum-600 text-white shadow-subtle hover:bg-plum-700 active:bg-plum-800',
	ghost: 'bg-transparent text-ink-700 hover:bg-ink-100/70 active:bg-ink-200/70',
	subtle: 'bg-brand-50 text-brand-900 hover:bg-brand-100 active:bg-brand-200',
	danger: 'bg-danger-500 text-white hover:bg-danger-700 active:bg-danger-700',
	outline:
		'bg-transparent text-brand-900 ring-1 ring-inset ring-brand-900/25 hover:bg-brand-50 active:bg-brand-100',
	link: 'bg-transparent text-brand-900 underline-offset-4 hover:underline px-0',
};

const SIZES = {
	xs: 'h-8 rounded-lg px-3 text-xs',
	sm: 'h-9 rounded-lg px-3.5 text-[13px]',
	md: 'h-11 rounded-field px-5 text-sm',
	lg: 'h-12 rounded-field px-6 text-[15px]',
};

const ICON_SIZES = {
	xs: 'h-8 w-8 rounded-lg',
	sm: 'h-9 w-9 rounded-lg',
	md: 'h-11 w-11 rounded-field',
	lg: 'h-12 w-12 rounded-field',
};

export const Button = ({
	variant = 'primary',
	size = 'md',
	to,
	href,
	type = 'button',
	iconOnly = false,
	leadingIcon,
	trailingIcon,
	isLoading = false,
	loadingText,
	fullWidth = false,
	disabled = false,
	className,
	children,
	...props
}) => {
	const classes = cn(
		BASE,
		VARIANTS[variant] ?? VARIANTS.primary,
		iconOnly ? ICON_SIZES[size] ?? ICON_SIZES.md : SIZES[size] ?? SIZES.md,
		fullWidth && 'w-full',
		className,
	);

	const content = (
		<>
			{isLoading ? (
				<svg
					className="h-4 w-4 animate-spin"
					viewBox="0 0 24 24"
					fill="none"
					aria-hidden="true"
				>
					<circle
						cx="12"
						cy="12"
						r="9"
						stroke="currentColor"
						strokeWidth="2.5"
						className="opacity-25"
					/>
					<path
						d="M21 12a9 9 0 0 0-9-9"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
					/>
				</svg>
			) : (
				leadingIcon && <Icon name={leadingIcon} size={size === 'lg' ? 'md' : 'sm'} />
			)}

			{isLoading && loadingText ? loadingText : children}

			{!isLoading && trailingIcon && (
				<Icon name={trailingIcon} size={size === 'lg' ? 'md' : 'sm'} />
			)}
		</>
	);

	if (to && !disabled && !isLoading) {
		return (
			<Link to={to} className={classes} {...props}>
				{content}
			</Link>
		);
	}

	if (href && !disabled && !isLoading) {
		return (
			<a
				href={href}
				className={classes}
				rel={props.target === '_blank' ? 'noreferrer noopener' : undefined}
				{...props}
			>
				{content}
			</a>
		);
	}

	return (
		<button
			type={type}
			className={classes}
			disabled={disabled || isLoading}
			aria-busy={isLoading || undefined}
			{...props}
		>
			{content}
		</button>
	);
};
