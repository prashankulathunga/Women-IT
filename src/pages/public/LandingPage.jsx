import { Icon } from '../../components/icons/Icon';
import { Container, Section } from '../../components/layout/Container';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { ROUTES } from '../../constants/routes';
import { BlogCard } from '../../features/learning/components/BlogCard';
import { JobCard } from '../../features/jobs/components/JobCard';
import { MentorCard } from '../../features/mentorship/components/MentorCard';
import { useAsync } from '../../hooks/useAsync';
import { formatDateTime } from '../../lib/format';
import { jobsService } from '../../services/jobs.service';
import { learningService } from '../../services/learning.service';
import { mentorsService } from '../../services/mentors.service';
import heroImage from '../../assets/Landingimg.jpg';

const PILLARS = [
	{
		icon: 'briefcase',
		title: 'A job board that states the truth',
		copy: 'Salary band, work mode and parental-leave policy on every posting — surfaced, not buried in paragraph nine.',
		points: ['Vetted employer partners', 'Returnship roles flagged', 'Filter on flexibility'],
	},
	{
		icon: 'compass',
		title: 'Mentors a few steps ahead',
		copy: 'Senior women in Sri Lankan tech who volunteer their time, matched on the goal you are actually working towards.',
		points: ['Directors, principals and heads of', 'Matched by focus area', 'No cost, ever'],
	},
	{
		icon: 'sparkle',
		title: 'Workshops that convert',
		copy: 'Interview clinics, negotiation practice and returnship programmes run with SLASSCOM and Women in Tech Sri Lanka.',
		points: ['Small enough for real feedback', 'Run by practitioners', 'Mostly free'],
	},
];

const STATS = [
	{ value: '72%', label: 'of women in Sri Lankan IT want a path beyond entry level' },
	{ value: '1 in 4', label: 'leave the industry within eight years of joining' },
	{ value: '38%', label: 'of technical roles at our partner companies are held by women' },
	{ value: '3×', label: 'more responses for members with a completed profile' },
];

const TESTIMONIALS = [
	{
		quote:
			'I had been applying into a void for eight months. Two conversations through Aruna and I had an offer at the level I actually wanted.',
		name: 'Ishara K.',
		title: 'Senior Engineer, Colombo',
	},
	{
		quote:
			'The negotiation clinic was worth about four hundred thousand rupees to me. I asked for a number I would never have said out loud before it.',
		name: 'Menaka R.',
		title: 'Engineering Lead, Colombo',
	},
	{
		quote:
			'After three years out I thought I was unemployable. The returnship listing here was the only one I found that was paid and mentored.',
		name: 'Fathima N.',
		title: 'Cloud Engineer, Kandy',
	},
];

const STEPS = [
	{
		number: '01',
		title: 'Create your account',
		copy: 'Tell us whether you are a woman in tech, a mentor, or a company hiring. It takes under a minute.',
	},
	{
		number: '02',
		title: 'Build your profile',
		copy: 'Your track, level, skills and what you are working towards. This is what everything else matches against.',
	},
	{
		number: '03',
		title: 'Apply, ask and learn',
		copy: 'Apply to vetted roles, request a mentor with a specific ask, and book workshops from your dashboard.',
	},
];

export const LandingPage = () => {
	const { data: jobs, isLoading: jobsLoading } = useAsync(() => jobsService.featured(3), []);
	const { data: mentors, isLoading: mentorsLoading } = useAsync(
		() => mentorsService.featured(3),
		[],
	);
	const { data: posts } = useAsync(() => learningService.featuredBlogs(3), []);
	const { data: workshops } = useAsync(() => learningService.featuredWorkshops(3), []);

	return (
		<>
			{/* ------------------------------------------------------------- hero */}
			<section className="relative overflow-hidden">
				<div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
				<div
					className="absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-plum-200/35 blur-3xl"
					aria-hidden="true"
				/>

				<Container className="relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-24">
					<div>
						<Badge tone="brand" size="lg" icon="spark">
							Built with SLASSCOM &amp; Women in Tech Sri Lanka
						</Badge>

						<h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
							The next step in your career is not luck. It is access.
						</h1>

						<p className="mt-6 max-w-xl text-base leading-relaxed text-ink-600">
							Aruna is the career-progression platform for women already working in
							Sri Lanka&apos;s IT industry. Curated roles that state what they
							actually offer, mentors a few steps ahead of you, and workshops that
							change what you ask for.
						</p>

						<div className="mt-8 flex flex-wrap items-center gap-3">
							<Button to={ROUTES.signup} size="lg" trailingIcon="arrow-right">
								Join the network
							</Button>
							<Button to={ROUTES.login} variant="secondary" size="lg">
								I already have an account
							</Button>
						</div>

						<div className="mt-10 flex items-center gap-4">
							<div className="flex -space-x-2.5">
								{['Dilini J', 'Thanuja F', 'Hasanthi P', 'Nadeesha S'].map((name) => (
									<Avatar key={name} name={name} size="sm" ring />
								))}
							</div>
							<p className="text-[13px] leading-snug text-ink-500">
								<span className="font-semibold text-ink-900">
									2,400+ women
								</span>{' '}
								in Sri Lankan tech, and counting.
							</p>
						</div>
					</div>

					<div className="relative">
						<div className="overflow-hidden rounded-panel shadow-elevated">
							<img
								src={heroImage}
								alt="A woman technologist leading a discussion in a modern Colombo office"
								className="aspect-[4/3] w-full object-cover lg:aspect-[4/4.4]"
							/>
						</div>

						<Card
							variant="elevated"
							padding="sm"
							className="absolute -bottom-6 -left-4 w-60 sm:-left-8"
						>
							<div className="flex items-center gap-3">
								<span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-50 text-success-700">
									<Icon name="trending-up" size="md" />
								</span>
								<div className="min-w-0">
									<p className="text-lg font-semibold tracking-tight text-ink-900">
										41%
									</p>
									<p className="text-xs leading-snug text-ink-500">
										women in technical roles at our top partner
									</p>
								</div>
							</div>
						</Card>
					</div>
				</Container>
			</section>

			{/* ------------------------------------------------------------ stats */}
			<Section spacing="sm" className="border-y border-line bg-surface-muted">
				<dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
					{STATS.map((stat) => (
						<div key={stat.label}>
							<dt className="font-display text-3xl font-semibold tracking-tight text-brand-900">
								{stat.value}
							</dt>
							<dd className="mt-2 text-[13px] leading-relaxed text-ink-500">
								{stat.label}
							</dd>
						</div>
					))}
				</dl>
			</Section>

			{/* --------------------------------------------------------- pillars */}
			<Section id="pillars">
				<div className="max-w-2xl">
					<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
						Why Aruna
					</p>
					<h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
						Three things that are hard to find in one place
					</h2>
					<p className="mt-4 text-base leading-relaxed text-ink-600">
						Most platforms give you a job board and call it a career. Progression
						needs opportunities, people who have done it before you, and the skills
						to ask for more.
					</p>
				</div>

				<div className="mt-12 grid gap-5 lg:grid-cols-3">
					{PILLARS.map((pillar) => (
						<Card key={pillar.title} padding="lg" className="flex flex-col">
							<span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-900 text-white">
								<Icon name={pillar.icon} size="md" />
							</span>

							<h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-ink-900">
								{pillar.title}
							</h3>
							<p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-600">
								{pillar.copy}
							</p>

							<ul className="mt-5 space-y-2 border-t border-line pt-4">
								{pillar.points.map((point) => (
									<li
										key={point}
										className="flex items-center gap-2.5 text-[13px] text-ink-600"
									>
										<Icon name="check" size="xs" className="text-brand-600" />
										{point}
									</li>
								))}
							</ul>
						</Card>
					))}
				</div>
			</Section>

			{/* ------------------------------------------------------------- jobs */}
			<Section id="jobs" className="bg-surface-muted">
				<div className="flex flex-wrap items-end justify-between gap-6">
					<div className="max-w-xl">
						<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
							Job board
						</p>
						<h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900">
							Roles worth your application
						</h2>
						<p className="mt-3 text-sm leading-relaxed text-ink-600">
							From employer partners who publish their salary band and their policies
							up front.
						</p>
					</div>

					<Button to={ROUTES.signup} variant="secondary" trailingIcon="arrow-right">
						See all roles
					</Button>
				</div>

				<div className="mt-10 grid gap-4 lg:grid-cols-3">
					{jobsLoading
						? Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
						: jobs?.map((job) => <JobCard key={job.id} job={job} />)}
				</div>
			</Section>

			{/* ---------------------------------------------------------- mentors */}
			<Section id="mentors">
				<div className="flex flex-wrap items-end justify-between gap-6">
					<div className="max-w-xl">
						<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
							Mentorship
						</p>
						<h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900">
							People who have already done it
						</h2>
						<p className="mt-3 text-sm leading-relaxed text-ink-600">
							Directors, principals and heads of, in Colombo and beyond. They
							volunteer their time — bring a specific ask.
						</p>
					</div>

					<Button to={ROUTES.signup} variant="secondary" trailingIcon="arrow-right">
						Browse mentors
					</Button>
				</div>

				<div className="mt-10 grid gap-4 lg:grid-cols-3">
					{mentorsLoading
						? Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
						: mentors?.map((mentor) => (
								<MentorCard key={mentor.id} mentor={mentor} compact />
							))}
				</div>
			</Section>

			{/* -------------------------------------------------------- workshops */}
			<Section id="workshops" className="bg-brand-900 text-white">
				<div className="max-w-2xl">
					<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
						Gain up skills
					</p>
					<h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
						Workshops that change what you ask for
					</h2>
					<p className="mt-4 text-base leading-relaxed text-white/70">
						Run at a small enough size that you get real feedback, by practitioners
						from Sri Lankan product companies.
					</p>
				</div>

				<div className="mt-12 grid gap-5 lg:grid-cols-3">
					{workshops?.map((workshop) => (
						<div
							key={workshop.id}
							className="flex flex-col rounded-card bg-white/[0.07] p-6 ring-1 ring-inset ring-white/12"
						>
							<div className="flex items-center gap-2">
								<Badge tone="inverse" size="sm" className="bg-white/15 ring-white/20">
									{workshop.format === 'in-person' ? 'In person' : workshop.format}
								</Badge>
								{workshop.price === 0 && (
									<Badge tone="inverse" size="sm" className="bg-plum-500 ring-plum-500">
										Free
									</Badge>
								)}
							</div>

							<h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
								{workshop.title}
							</h3>
							<p className="mt-2 flex-1 text-[13px] leading-relaxed text-white/65">
								{workshop.summary}
							</p>

							<div className="mt-5 flex items-center gap-2 border-t border-white/12 pt-4 text-xs text-white/55">
								<Icon name="calendar" size="xs" />
								{formatDateTime(workshop.startsAt)}
							</div>
						</div>
					))}
				</div>

				<Button to={ROUTES.signup} variant="secondary" size="lg" className="mt-10">
					Reserve a seat
				</Button>
			</Section>

			{/* ------------------------------------------------------ how it works */}
			<Section>
				<div className="max-w-2xl">
					<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
						How it works
					</p>
					<h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
						Three steps, about two minutes
					</h2>
				</div>

				<div className="mt-12 grid gap-8 lg:grid-cols-3">
					{STEPS.map((step) => (
						<div key={step.number} className="border-t-2 border-brand-900 pt-5">
							<p className="font-display text-sm font-semibold tracking-widest text-brand-900">
								{step.number}
							</p>
							<h3 className="mt-3 font-display text-lg font-semibold tracking-tight text-ink-900">
								{step.title}
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-ink-600">{step.copy}</p>
						</div>
					))}
				</div>
			</Section>

			{/* ----------------------------------------------------------- stories */}
			<Section id="stories" className="bg-surface-muted">
				<div className="flex flex-wrap items-end justify-between gap-6">
					<div className="max-w-xl">
						<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
							Stories
						</p>
						<h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900">
							What actually worked
						</h2>
					</div>

					<Button to={ROUTES.signup} variant="secondary" trailingIcon="arrow-right">
						Read the blog
					</Button>
				</div>

				<div className="mt-10 grid gap-4 lg:grid-cols-3">
					{posts?.map((post) => (
						<BlogCard key={post.slug} post={post} />
					))}
				</div>

				<div className="mt-12 grid gap-5 lg:grid-cols-3">
					{TESTIMONIALS.map((testimonial) => (
						<figure
							key={testimonial.name}
							className="rounded-card border border-line bg-white p-6"
						>
							<Icon name="quote" size="md" className="text-plum-500" />
							<blockquote className="mt-3 text-sm leading-relaxed text-ink-700">
								{testimonial.quote}
							</blockquote>
							<figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
								<Avatar name={testimonial.name} size="sm" />
								<div className="min-w-0">
									<p className="truncate text-[13px] font-semibold text-ink-900">
										{testimonial.name}
									</p>
									<p className="truncate text-xs text-ink-400">{testimonial.title}</p>
								</div>
							</figcaption>
						</figure>
					))}
				</div>
			</Section>

			{/* --------------------------------------------------------------- cta */}
			<Section spacing="lg">
				<div className="relative overflow-hidden rounded-panel bg-brand-900 px-6 py-14 text-center text-white sm:px-12">
					<div className="bg-grid absolute inset-0 opacity-30" aria-hidden="true" />
					<div
						className="absolute -bottom-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-plum-500/25 blur-3xl"
						aria-hidden="true"
					/>

					<div className="relative mx-auto max-w-2xl">
						<h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
							Stay in the industry. On your terms.
						</h2>
						<p className="mt-4 text-base leading-relaxed text-white/70">
							Join 2,400+ women in Sri Lankan tech who are using Aruna to find their
							next role, their next mentor and their next skill.
						</p>

						<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
							<Button to={ROUTES.signup} variant="secondary" size="lg">
								Create your free account
							</Button>
							<Button
								to={ROUTES.signup}
								variant="ghost"
								size="lg"
								className="text-white hover:bg-white/10"
								trailingIcon="arrow-right"
							>
								Partner with us
							</Button>
						</div>
					</div>
				</div>
			</Section>
		</>
	);
};
