import { cn } from '../../lib/cn';

/**
 * Single stroke-based icon set.
 *
 * Icons are referenced by name (`<Icon name="briefcase" />`) so data-driven
 * surfaces like the sidebar can carry an icon key instead of a component,
 * and so the whole product shares one optical weight.
 */
const PATHS = {
	grid: (
		<>
			<rect x="3" y="3" width="7" height="7" rx="1.5" />
			<rect x="14" y="3" width="7" height="7" rx="1.5" />
			<rect x="3" y="14" width="7" height="7" rx="1.5" />
			<rect x="14" y="14" width="7" height="7" rx="1.5" />
		</>
	),
	briefcase: (
		<>
			<rect x="2" y="7" width="20" height="14" rx="2" />
			<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
			<path d="M2 13h20" />
		</>
	),
	clipboard: (
		<>
			<rect x="8" y="2" width="8" height="4" rx="1" />
			<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
			<path d="M9 12h6M9 16h4" />
		</>
	),
	users: (
		<>
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
		</>
	),
	compass: (
		<>
			<circle cx="12" cy="12" r="10" />
			<path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
		</>
	),
	messages: (
		<>
			<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
			<path d="M8 9h8M8 13h5" />
		</>
	),
	book: (
		<>
			<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
			<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
		</>
	),
	sparkle: (
		<>
			<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
			<path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
		</>
	),
	user: (
		<>
			<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
			<circle cx="12" cy="7" r="4" />
		</>
	),
	settings: (
		<>
			<circle cx="12" cy="12" r="3" />
			<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
		</>
	),
	search: (
		<>
			<circle cx="11" cy="11" r="7" />
			<path d="m21 21-4.35-4.35" />
		</>
	),
	'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
	'arrow-left': <path d="M19 12H5M11 18l-6-6 6-6" />,
	'arrow-up-right': <path d="M7 17 17 7M8 7h9v9" />,
	check: <path d="m20 6-11 11-5-5" />,
	'check-circle': (
		<>
			<circle cx="12" cy="12" r="10" />
			<path d="m8.5 12.5 2.5 2.5 4.5-5" />
		</>
	),
	close: <path d="M18 6 6 18M6 6l12 12" />,
	menu: <path d="M3 6h18M3 12h18M3 18h18" />,
	bell: (
		<>
			<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
			<path d="M13.73 21a2 2 0 0 1-3.46 0" />
		</>
	),
	'chevron-down': <path d="m6 9 6 6 6-6" />,
	'chevron-right': <path d="m9 18 6-6-6-6" />,
	'chevron-left': <path d="m15 18-6-6 6-6" />,
	logout: (
		<>
			<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
			<path d="m16 17 5-5-5-5M21 12H9" />
		</>
	),
	eye: (
		<>
			<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
			<circle cx="12" cy="12" r="3" />
		</>
	),
	'eye-off': (
		<>
			<path d="M3 3l18 18" />
			<path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
			<path d="M9.88 5.09A9.77 9.77 0 0 1 12 5c5 0 9 4.5 9 7a10.94 10.94 0 0 1-3.14 3.9M6.1 6.1C3.86 7.6 2 9.99 2 12c0 2.5 4 7 10 7a9.7 9.7 0 0 0 4.02-.87" />
		</>
	),
	'map-pin': (
		<>
			<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
			<circle cx="12" cy="10" r="3" />
		</>
	),
	clock: (
		<>
			<circle cx="12" cy="12" r="10" />
			<path d="M12 6v6l4 2" />
		</>
	),
	calendar: (
		<>
			<rect x="3" y="4" width="18" height="18" rx="2" />
			<path d="M16 2v4M8 2v4M3 10h18" />
		</>
	),
	star: (
		<path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.8l6.5-.9L12 3z" />
	),
	bookmark: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
	filter: <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />,
	plus: <path d="M12 5v14M5 12h14" />,
	minus: <path d="M5 12h14" />,
	external: (
		<>
			<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
			<path d="M15 3h6v6M10 14 21 3" />
		</>
	),
	linkedin: (
		<>
			<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-9h4v1.5" />
			<rect x="2" y="9" width="4" height="12" />
			<circle cx="4" cy="4" r="2" />
		</>
	),
	mail: (
		<>
			<rect x="2" y="4" width="20" height="16" rx="2" />
			<path d="m2 7 10 6 10-6" />
		</>
	),
	phone: (
		<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.5a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
	),
	shield: (
		<>
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
			<path d="m9 12 2 2 4-4" />
		</>
	),
	'trending-up': (
		<>
			<path d="m22 7-8.5 8.5-5-5L2 17" />
			<path d="M16 7h6v6" />
		</>
	),
	award: (
		<>
			<circle cx="12" cy="8" r="6" />
			<path d="m8.2 13.4-1.4 7.6L12 18.5l5.2 2.5-1.4-7.6" />
		</>
	),
	alert: (
		<>
			<circle cx="12" cy="12" r="10" />
			<path d="M12 8v5M12 16.5v.01" />
		</>
	),
	info: (
		<>
			<circle cx="12" cy="12" r="10" />
			<path d="M12 16v-5M12 7.5v.01" />
		</>
	),
	building: (
		<>
			<rect x="4" y="2" width="16" height="20" rx="2" />
			<path d="M9 22v-4h6v4M9 6h.01M15 6h.01M9 10h.01M15 10h.01M9 14h.01M15 14h.01" />
		</>
	),
	globe: (
		<>
			<circle cx="12" cy="12" r="10" />
			<path d="M2 12h20" />
			<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
		</>
	),
	heart: (
		<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z" />
	),
	lightbulb: (
		<>
			<path d="M9 18h6M10 22h4" />
			<path d="M15.1 14a5 5 0 1 0-6.2 0c.6.5 1.1 1.3 1.1 2h4c0-.7.5-1.5 1.1-2z" />
		</>
	),
	upload: (
		<>
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
			<path d="M7 9l5-5 5 5M12 4v12" />
		</>
	),
	quote: (
		<path d="M9 7H5.5A2.5 2.5 0 0 0 3 9.5v2A2.5 2.5 0 0 0 5.5 14H7v1a3 3 0 0 1-3 3M21 7h-3.5A2.5 2.5 0 0 0 15 9.5v2a2.5 2.5 0 0 0 2.5 2.5H19v1a3 3 0 0 1-3 3" />
	),
	spark: <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4" />,
};

const SIZES = {
	xs: 'h-3.5 w-3.5',
	sm: 'h-4 w-4',
	md: 'h-5 w-5',
	lg: 'h-6 w-6',
	xl: 'h-8 w-8',
};

export const Icon = ({
	name,
	size = 'sm',
	className,
	strokeWidth = 1.75,
	title,
	...props
}) => {
	const path = PATHS[name];
	if (!path) return null;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={cn('shrink-0', SIZES[size] ?? SIZES.sm, className)}
			role={title ? 'img' : 'presentation'}
			aria-hidden={title ? undefined : true}
			aria-label={title}
			{...props}
		>
			{title ? <title>{title}</title> : null}
			{path}
		</svg>
	);
};
