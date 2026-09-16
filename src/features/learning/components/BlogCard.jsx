import { Link } from 'react-router-dom';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { BLOG_CATEGORIES } from '../../../data/learning';
import { labelFor } from '../../../constants/options';
import { ROUTES } from '../../../constants/routes';
import { formatDate, readingTime } from '../../../lib/format';

/** Article teaser for the blogs index and dashboard widgets. */
export const BlogCard = ({ post, compact = false }) => (
	<Card interactive className="relative flex h-full flex-col">
		<div className="flex items-center gap-2">
			<Badge tone="accent" size="sm">
				{labelFor(BLOG_CATEGORIES, post.category)}
			</Badge>
			<span className="text-xs text-ink-400">
				{readingTime(post.body.join(' '))}
			</span>
		</div>

		<h3 className="mt-3 font-display text-lg font-semibold leading-snug tracking-tight text-ink-900">
			<Link
				to={ROUTES.blogDetail(post.slug)}
				className="outline-none after:absolute after:inset-0 after:content-[''] hover:text-brand-900"
			>
				{post.title}
			</Link>
		</h3>

		{!compact && (
			<p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-ink-600">
				{post.excerpt}
			</p>
		)}

		<div className="mt-5 flex items-center gap-2.5 border-t border-line pt-4">
			<Avatar name={post.author} size="sm" />
			<div className="min-w-0">
				<p className="truncate text-[13px] font-semibold text-ink-800">{post.author}</p>
				<p className="truncate text-xs text-ink-400">
					{compact ? formatDate(post.publishedAt) : post.authorTitle}
				</p>
			</div>
		</div>
	</Card>
);
