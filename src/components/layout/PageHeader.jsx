import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/**
 * Standard heading block for every in-app page: optional breadcrumb, eyebrow,
 * title, supporting copy and an action slot.
 */
export const PageHeader = ({
	eyebrow,
	title,
	description,
	actions,
	backTo,
	backLabel = 'Back',
	className,
	children,
}) => (
	<header className={cn('mb-6 sm:mb-8', className)}>
		{backTo && (
			<Link
				to={backTo}
				className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-500 transition-colors hover:text-brand-900"
			>
				<Icon name="arrow-left" size="xs" />
				{backLabel}
			</Link>
		)}

		<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div className="min-w-0">
				{eyebrow && (
					<p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
						{eyebrow}
					</p>
				)}

				<h1 className="font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
					{title}
				</h1>

				{description && (
					<p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">
						{description}
					</p>
				)}
			</div>

			{actions && (
				<div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>
			)}
		</div>

		{children}
	</header>
);
