import { useCallback } from 'react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { StatCard } from '../../components/ui/StatCard';
import { REQUEST_STATUS } from '../../constants/options';
import { ROUTES } from '../../constants/routes';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../hooks/useAuth';
import { learningService } from '../../services/learning.service';
import { mentorsService } from '../../services/mentors.service';
import { BlogCard } from '../learning/components/BlogCard';
import { RequestCard } from '../mentorship/components/RequestCard';
import { SectionHeading } from './components/SectionHeading';

/** Dashboard for mentors: incoming requests first, everything else after. */
export const MentorOverview = () => {
	const { user } = useAuth();

	const load = useCallback(
		() =>
			Promise.all([
				mentorsService.listForMentor(user.profile?.mentorDirectoryId),
				learningService.featuredBlogs(3),
			]).then(([requests, blogs]) => ({ requests, blogs })),
		[user.profile?.mentorDirectoryId],
	);

	const { data, error, isLoading, refetch } = useAsync(load, [user.id]);

	if (isLoading) {
		return (
			<div className="space-y-4">
				<SkeletonCard />
				<SkeletonCard />
			</div>
		);
	}

	if (error) return <ErrorState message={error} onRetry={refetch} />;
	if (!data) return null;

	const pending = data.requests.filter((row) => row.status === REQUEST_STATUS.PENDING);
	const accepted = data.requests.filter((row) => row.status === REQUEST_STATUS.ACCEPTED);

	return (
		<div className="space-y-10">
			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard
					label="Pending requests"
					value={pending.length}
					icon="messages"
					tone="warning"
					hint={pending.length > 0 ? 'Awaiting your reply' : 'Nothing waiting'}
				/>
				<StatCard
					label="Active mentees"
					value={accepted.length}
					icon="users"
					tone="success"
					hint={`Capacity ${user.profile?.capacity || '—'}`}
				/>
				<StatCard
					label="Focus areas"
					value={user.profile?.focusAreas?.length ?? 0}
					icon="compass"
					tone="brand"
					hint="Shown on your profile"
				/>
				<StatCard
					label="Expertise listed"
					value={user.profile?.skills?.length ?? 0}
					icon="award"
					tone="info"
					hint="Keep these current"
				/>
			</section>

			<section>
				<SectionHeading
					title="Requests waiting on you"
					description="Mentees who have asked for a specific piece of help."
					to={ROUTES.mentorRequests}
					linkLabel="All requests"
				/>

				{pending.length > 0 ? (
					<div className="space-y-4">
						{pending.slice(0, 3).map((request) => (
							<RequestCard
								key={request.id}
								request={request}
								perspective="mentor"
								onRespond={async (row, status) => {
									await mentorsService.respond(row.id, status);
									refetch();
								}}
							/>
						))}
					</div>
				) : (
					<EmptyState
						icon="check-circle"
						tone="brand"
						title="You are all caught up"
						description="New mentorship requests will appear here as they arrive."
						compact
					/>
				)}
			</section>

			<section>
				<Card variant="muted" padding="lg">
					<CardHeader
						title="Make yourself easier to find"
						description="Mentors with a filled-in focus list and a specific bio get roughly three times more requests."
						action={
							<Button to={ROUTES.profile} size="sm" variant="secondary">
								Edit profile
							</Button>
						}
					/>
				</Card>
			</section>

			<section>
				<SectionHeading
					title="From the community"
					description="What other mentors are publishing."
					to={ROUTES.blogs}
					linkLabel="All articles"
				/>

				<div className="grid gap-4 lg:grid-cols-3">
					{data.blogs.map((post) => (
						<BlogCard key={post.slug} post={post} />
					))}
				</div>
			</section>
		</div>
	);
};
