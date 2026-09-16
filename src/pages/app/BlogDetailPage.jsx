import { useParams } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/EmptyState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { labelFor } from '../../constants/options';
import { ROUTES } from '../../constants/routes';
import { BLOG_CATEGORIES } from '../../data/learning';
import { BlogCard } from '../../features/learning/components/BlogCard';
import { useAsync } from '../../hooks/useAsync';
import { formatDate, readingTime } from '../../lib/format';
import { learningService } from '../../services/learning.service';

export const BlogDetailPage = () => {
	const { slug } = useParams();

	const {
		data: post,
		error,
		isLoading,
		refetch,
	} = useAsync(() => learningService.getBlog(slug), [slug]);

	if (isLoading) return <SkeletonCard />;
	if (error) return <ErrorState message={error} onRetry={refetch} />;
	if (!post) return null;

	return (
		<article className="mx-auto max-w-3xl">
			<PageHeader backTo={ROUTES.blogs} backLabel="Back to articles" title={post.title}>
				<div className="mt-5 flex flex-wrap items-center gap-2">
					<Badge tone="accent" size="md">
						{labelFor(BLOG_CATEGORIES, post.category)}
					</Badge>
					<span className="text-[13px] text-ink-400">
						{formatDate(post.publishedAt)} · {readingTime(post.body.join(' '))}
					</span>
				</div>

				<div className="mt-5 flex items-center gap-3 border-t border-line pt-5">
					<Avatar name={post.author} size="md" />
					<div className="min-w-0">
						<p className="truncate text-sm font-semibold text-ink-900">{post.author}</p>
						<p className="truncate text-[13px] text-ink-500">{post.authorTitle}</p>
					</div>
				</div>
			</PageHeader>

			<div className="space-y-5">
				<p className="font-display text-xl leading-relaxed text-ink-800">
					{post.excerpt}
				</p>

				{post.body.map((paragraph, index) => (
					<p key={index} className="text-[15px] leading-[1.75] text-ink-700">
						{paragraph}
					</p>
				))}
			</div>

			{post.tags?.length > 0 && (
				<div className="mt-8 flex flex-wrap gap-2 border-t border-line pt-6">
					{post.tags.map((tag) => (
						<Badge key={tag} tone="outline" size="md">
							{tag}
						</Badge>
					))}
				</div>
			)}

			<Card variant="muted" className="mt-8">
				<div className="flex items-start gap-4">
					<Avatar name={post.author} size="lg" />
					<div className="min-w-0">
						<p className="text-sm font-semibold text-ink-900">
							Written by {post.author}
						</p>
						<p className="mt-1 text-[13px] leading-relaxed text-ink-600">
							{post.authorTitle}. Contributors write from their own experience in the
							Sri Lankan technology industry.
						</p>
					</div>
				</div>
			</Card>

			{post.related?.length > 0 && (
				<section className="mt-12">
					<h2 className="font-display text-lg font-semibold tracking-tight text-ink-900">
						More like this
					</h2>
					<div className="mt-4 grid gap-4 sm:grid-cols-2">
						{post.related.map((related) => (
							<BlogCard key={related.slug} post={related} compact />
						))}
					</div>
				</section>
			)}
		</article>
	);
};
