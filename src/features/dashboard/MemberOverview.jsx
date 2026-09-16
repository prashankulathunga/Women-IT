import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorState, EmptyState } from '../../components/ui/EmptyState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { StatCard } from '../../components/ui/StatCard';
import { APPLICATION_STATUS } from '../../constants/options';
import { ROUTES } from '../../constants/routes';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../hooks/useAuth';
import { jobsService } from '../../services/jobs.service';
import { learningService } from '../../services/learning.service';
import { mentorsService } from '../../services/mentors.service';
import { BlogCard } from '../learning/components/BlogCard';
import { WorkshopCard } from '../learning/components/WorkshopCard';
import { JobCard } from '../jobs/components/JobCard';
import { MentorCard } from '../mentorship/components/MentorCard';
import { SectionHeading } from './components/SectionHeading';

/** Dashboard for women-in-tech members: the three pillars from the product map. */
export const MemberOverview = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const load = useCallback(
		() =>
			Promise.all([
				jobsService.featured(2),
				mentorsService.featured(2),
				learningService.featuredBlogs(2),
				learningService.featuredWorkshops(1),
				jobsService.listApplications(user.id),
				mentorsService.listForMember(user.id),
				learningService.listEnrolments(user.id),
			]).then(
				([jobs, mentors, blogs, workshops, applications, requests, enrolments]) => ({
					jobs,
					mentors,
					blogs,
					workshops,
					applications,
					requests,
					enrolments,
				}),
			),
		[user.id],
	);

	const { data, error, isLoading, refetch } = useAsync(load, [user.id]);

	if (isLoading) {
		return (
			<div className="grid gap-4 sm:grid-cols-2">
				{Array.from({ length: 4 }).map((_, index) => (
					<SkeletonCard key={index} />
				))}
			</div>
		);
	}

	if (error) return <ErrorState message={error} onRetry={refetch} />;
	if (!data) return null;

	const activeApplications = data.applications.filter(
		(row) => row.status !== APPLICATION_STATUS.CLOSED,
	).length;
	const pendingRequests = data.requests.filter((row) => row.status === 'pending').length;

	return (
		<div className="space-y-10">
			<section>
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<StatCard
						label="Active applications"
						value={activeApplications}
						icon="clipboard"
						tone="brand"
						hint={`${data.applications.length} submitted in total`}
					/>
					<StatCard
						label="Mentor requests"
						value={data.requests.length}
						icon="messages"
						tone="accent"
						hint={pendingRequests > 0 ? `${pendingRequests} awaiting reply` : 'All answered'}
					/>
					<StatCard
						label="Workshops booked"
						value={data.enrolments.length}
						icon="sparkle"
						tone="success"
						hint="Upcoming sessions"
					/>
					<StatCard
						label="Skills on profile"
						value={user.profile?.skills?.length ?? 0}
						icon="award"
						tone="info"
						hint="Keep these current"
					/>
				</div>
			</section>

			<section>
				<SectionHeading
					title="Roles worth your time"
					description="Matched against your track, level and stated goals."
					to={ROUTES.jobs}
					linkLabel="Open job board"
				/>

				{data.jobs.length > 0 ? (
					<div className="grid gap-4 lg:grid-cols-2">
						{data.jobs.map((job) => (
							<JobCard key={job.id} job={job} />
						))}
					</div>
				) : (
					<EmptyState
						icon="briefcase"
						title="No roles to show yet"
						description="New postings land every week — check the board."
						compact
					/>
				)}
			</section>

			<section>
				<SectionHeading
					title="Mentors a few steps ahead"
					description="Senior women in Sri Lankan tech, matched on what you are working towards."
					to={ROUTES.mentors}
					linkLabel="Browse mentors"
				/>

				<div className="grid gap-4 lg:grid-cols-2">
					{data.mentors.map((mentor) => (
						<MentorCard key={mentor.id} mentor={mentor} />
					))}
				</div>
			</section>

			<section>
				<SectionHeading
					title="Gain up skills"
					description="Stories from women ahead of you, and workshops with real outcomes."
					to={ROUTES.blogs}
					linkLabel="All articles"
				/>

				<div className="grid gap-4 lg:grid-cols-3">
					{data.blogs.map((post) => (
						<BlogCard key={post.slug} post={post} />
					))}
					{data.workshops.map((workshop) => (
						<WorkshopCard
							key={workshop.id}
							workshop={workshop}
							onRegister={() => navigate(ROUTES.workshops)}
						/>
					))}
				</div>
			</section>
		</div>
	);
};
