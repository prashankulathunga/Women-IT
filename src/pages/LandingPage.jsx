import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Section } from "../components/layout/section";
import heroImage from "../assets/Landingimg.jpg";

const ArrowIcon = ({ className = "" }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={`h-4 w-4 ${className}`}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M5 12h14M13 6l6 6-6 6" />
	</svg>
);

export const LandingPage = () => {
	return (
		<div className="flex min-h-screen flex-col bg-[#FAF9F5]">

			<main className="flex-1">
				<Section>
					<div className="grid items-center gap-10 py-8 sm:py-12 lg:grid-cols-2 lg:gap-16 lg:py-16">
						<div>
							<p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
								The Aruna Insight
							</p>
							<h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
								72% of women in Sri Lankan IT seek leadership pathways beyond
								entry-level.
							</h1>
							<p className="mt-6 max-w-lg text-base leading-relaxed text-gray-600">
								Aruna is the definitive platform for mid-to-senior female
								technologists in Sri Lanka. We bridge the gap between technical
								expertise and executive leadership through curated
								opportunities, mentorship, and high-impact networks.
							</p>
							<button
								type="button"
								className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-[#020079] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#020079]/90"
							>
								Join the Network
								<ArrowIcon className="transition-transform group-hover:translate-x-1" />
							</button>
						</div>

						<div className="overflow-hidden rounded-2xl shadow-lg">
							<img
								src={heroImage}
								alt="A woman in tech leadership standing confidently in a modern office"
								className="aspect-[4/3] w-full object-cover sm:aspect-[3/2] lg:aspect-[4/5]"
							/>
						</div>
					</div>
				</Section>
			</main>

			<Footer />
		</div>
	);
};
