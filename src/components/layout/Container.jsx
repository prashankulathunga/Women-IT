import { cn } from '../../lib/cn';

/**
 * Horizontal rhythm primitive.
 * Owning the max-width and the gutter here is what keeps every page aligned
 * to the same grid at every breakpoint.
 */
const WIDTHS = {
	sm: 'max-w-3xl',
	md: 'max-w-5xl',
	lg: 'max-w-6xl',
	xl: 'max-w-7xl',
	full: 'max-w-none',
};

export const Container = ({
	as: Component = 'div',
	width = 'xl',
	className,
	children,
	...props
}) => (
	<Component
		className={cn(
			'mx-auto w-full px-4 sm:px-6 lg:px-8',
			WIDTHS[width] ?? WIDTHS.xl,
			className,
		)}
		{...props}
	>
		{children}
	</Component>
);

const SPACING = {
	none: '',
	sm: 'py-10 sm:py-14',
	md: 'py-14 sm:py-20',
	lg: 'py-20 sm:py-28',
};

/** Vertical rhythm primitive for marketing sections. */
export const Section = ({
	as: Component = 'section',
	width = 'xl',
	spacing = 'md',
	className,
	containerClassName,
	children,
	...props
}) => (
	<Component className={cn(SPACING[spacing] ?? SPACING.md, className)} {...props}>
		<Container width={width} className={containerClassName}>
			{children}
		</Container>
	</Component>
);
