import { Link } from 'react-router-dom';
import { Icon } from '../../../components/icons/Icon';
import { cn } from '../../../lib/cn';

/** "Recommended for you  ·  View all →" heading used above dashboard rails. */
export const SectionHeading = ({ title, description, to, linkLabel = 'View all', className }) => (
	<div className={cn('mb-4 flex items-end justify-between gap-4', className)}>
		<div className="min-w-0">
			<h2 className="font-display text-lg font-semibold tracking-tight text-ink-900">
				{title}
			</h2>
			{description && (
				<p className="mt-0.5 text-[13px] text-ink-500">{description}</p>
			)}
		</div>

		{to && (
			<Link
				to={to}
				className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-brand-900 transition-colors hover:text-brand-700"
			>
				{linkLabel}
				<Icon name="arrow-right" size="xs" />
			</Link>
		)}
	</div>
);
