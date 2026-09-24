import { Link, Outlet } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Icon } from '../components/icons/Icon';
import { ROUTES } from '../constants/routes';

/**
 * Split shell for login and signup: the form on the left, a quiet proof
 * panel on the right that collapses away on small screens.
 */
const PROOF_POINTS = [
	{
		icon: 'briefcase',
		title: 'Roles that name flexibility',
		copy: 'Every posting states work mode, salary band and the policies that actually matter.',
	},
	{
		icon: 'compass',
		title: 'Mentors a few steps ahead',
		copy: 'Senior women in Sri Lankan tech, matched on the goal you are working towards.',
	},
	{
		icon: 'sparkle',
		title: 'Workshops that convert',
		copy: 'Interview clinics, negotiation practice and returnship programmes with real outcomes.',
	},
];

export const AuthLayout = () => (
	<div className="grid min-h-screen bg-canvas lg:grid-cols-[1fr_1.05fr]">
		<div className="flex flex-col px-4 py-8 sm:px-8 lg:px-12">
			<div className="flex items-center justify-between gap-4">
				<Logo showTagline={false} />
				<Link
					to={ROUTES.home}
					className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-500 transition-colors hover:text-brand-900"
				>
					<Icon name="arrow-left" size="xs" />
					Back to site
				</Link>
			</div>

			<div className="flex flex-1 items-center justify-center py-10">
				<div className="w-full max-w-[26rem]">
					<Outlet />
				</div>
			</div>

			<p className="text-center text-xs text-ink-400">
				© {new Date().getFullYear()} Aruna · Colombo, Sri Lanka
			</p>
		</div>

		<aside className="relative hidden overflow-hidden bg-brand-900 lg:flex lg:flex-col lg:justify-between">
			<div className="bg-grid absolute inset-0 opacity-[0.35]" aria-hidden="true" />
			<div
				className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-plum-500/25 blur-3xl"
				aria-hidden="true"
			/>
			<div
				className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-brand-400/25 blur-3xl"
				aria-hidden="true"
			/>

			<div className="relative p-12">
				<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
					The Aruna network
				</p>
				<h2 className="mt-5 max-w-md font-display text-3xl font-semibold leading-tight tracking-tight text-white xl:text-4xl">
					Built for women who are already in the industry — and intend to stay.
				</h2>

				<ul className="mt-10 space-y-6">
					{PROOF_POINTS.map((point) => (
						<li key={point.title} className="flex gap-4">
							<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-inset ring-white/15">
								<Icon name={point.icon} size="md" />
							</span>
							<div>
								<p className="text-sm font-semibold text-white">{point.title}</p>
								<p className="mt-1 max-w-sm text-[13px] leading-relaxed text-white/60">
									{point.copy}
								</p>
							</div>
						</li>
					))}
				</ul>
			</div>

			<div className="relative border-t border-white/10 p-12">
				<figure>
					<Icon name="quote" size="lg" className="text-plum-300" />
					<blockquote className="mt-4 max-w-md font-display text-lg leading-relaxed text-white/90">
						I had been applying into a void for eight months. Two conversations
						through Aruna and I had an offer at the level I actually wanted.
					</blockquote>
					<figcaption className="mt-4 text-[13px] text-white/50">
						Ishara K. — Senior Engineer, Colombo
					</figcaption>
				</figure>
			</div>
		</aside>
	</div>
);
