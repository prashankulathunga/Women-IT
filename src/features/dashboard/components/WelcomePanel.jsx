import { Icon } from '../../../components/icons/Icon';
import { Button } from '../../../components/ui/Button';
import { Progress } from '../../../components/ui/Progress';
import { ROUTES } from '../../../constants/routes';
import { cn } from '../../../lib/cn';

/** Greeting banner with the profile-completion nudge. */
const greeting = () => {
	const hour = new Date().getHours();
	if (hour < 12) return 'Good morning';
	if (hour < 17) return 'Good afternoon';
	return 'Good evening';
};

export const WelcomePanel = ({ name, subtitle, completion = 0, className }) => (
	<div
		className={cn(
			'relative overflow-hidden rounded-panel bg-brand-900 p-6 text-white sm:p-8',
			className,
		)}
	>
		<div className="bg-grid absolute inset-0 opacity-30" aria-hidden="true" />
		<div
			className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-plum-500/25 blur-3xl"
			aria-hidden="true"
		/>

		<div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
			<div className="min-w-0">
				<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
					{greeting()}
				</p>
				<h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
					{name}
				</h1>
				<p className="mt-2 max-w-lg text-sm leading-relaxed text-white/70">
					{subtitle}
				</p>
			</div>

			{completion < 100 && (
				<div className="w-full shrink-0 rounded-card bg-white/10 p-4 ring-1 ring-inset ring-white/15 lg:w-72">
					<div className="flex items-center gap-2">
						<Icon name="lightbulb" className="text-plum-200" />
						<p className="text-[13px] font-semibold">Profile {completion}% complete</p>
					</div>

					<Progress value={completion} tone="accent" size="sm" className="mt-3" />

					<Button
						to={ROUTES.profile}
						size="xs"
						variant="secondary"
						className="mt-3.5"
						trailingIcon="arrow-right"
					>
						Complete profile
					</Button>
				</div>
			)}
		</div>
	</div>
);
