import { Link } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { Container } from '../../components/layout/Container';
import { FOOTER_NAV } from '../../constants/navigation';

/** Public site footer. */
export const MarketingFooter = () => (
	<footer className="border-t border-line bg-surface-muted">
		<Container className="py-14">
			<div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
				<div>
					<Logo />
					<p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-500">
						Aruna is a career-progression platform for women already working in Sri
						Lanka&apos;s IT industry. Built in alignment with SLASSCOM and Women in
						Tech Sri Lanka.
					</p>
				</div>

				<div className="grid gap-8 sm:grid-cols-3">
					{FOOTER_NAV.map((group) => (
						<div key={group.title}>
							<h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
								{group.title}
							</h3>
							<ul className="mt-4 space-y-2.5">
								{group.links.map((link) => (
									<li key={link.label}>
										<Link
											to={link.to}
											className="text-sm text-ink-600 transition-colors hover:text-brand-900"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>

			<div className="mt-12 flex flex-col items-center gap-3 border-t border-line pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
				<p className="text-[13px] text-ink-400">
					© {new Date().getFullYear()} Aruna. Empowering women in Sri Lankan IT.
				</p>
				<p className="text-[13px] text-ink-400">Colombo, Sri Lanka</p>
			</div>
		</Container>
	</footer>
);
