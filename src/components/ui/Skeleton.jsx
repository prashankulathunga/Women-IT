import { cn } from '../../lib/cn';

/**
 * Loading placeholder.
 * Skeletons mirror the shape of the real content so lists do not reflow when
 * data lands.
 */
export const Skeleton = ({ className, rounded = 'rounded-lg' }) => (
	<div
		aria-hidden="true"
		className={cn(
			'animate-shimmer bg-[linear-gradient(90deg,var(--color-ink-100)_25%,var(--color-ink-50)_37%,var(--color-ink-100)_63%)] bg-[length:400%_100%]',
			rounded,
			className,
		)}
	/>
);

export const SkeletonText = ({ lines = 3, className }) => (
	<div className={cn('space-y-2', className)}>
		{Array.from({ length: lines }).map((_, index) => (
			<Skeleton
				key={index}
				className={cn('h-3', index === lines - 1 ? 'w-2/3' : 'w-full')}
			/>
		))}
	</div>
);

/** Card-shaped placeholder used by the job, mentor and workshop lists. */
export const SkeletonCard = ({ className }) => (
	<div className={cn('rounded-card border border-line bg-white p-5 sm:p-6', className)}>
		<div className="flex items-start gap-4">
			<Skeleton className="h-11 w-11" rounded="rounded-xl" />
			<div className="flex-1 space-y-2.5">
				<Skeleton className="h-4 w-2/3" />
				<Skeleton className="h-3 w-1/3" />
			</div>
		</div>
		<SkeletonText lines={2} className="mt-5" />
		<div className="mt-5 flex gap-2">
			<Skeleton className="h-6 w-20" rounded="rounded-full" />
			<Skeleton className="h-6 w-24" rounded="rounded-full" />
			<Skeleton className="h-6 w-16" rounded="rounded-full" />
		</div>
	</div>
);

export const SkeletonList = ({ count = 3, className }) => (
	<div className={cn('space-y-4', className)}>
		{Array.from({ length: count }).map((_, index) => (
			<SkeletonCard key={index} />
		))}
	</div>
);
