import { useState } from "react";
import { Link } from "react-router-dom";
import { Section } from "../components/layout/section";

const BriefcaseIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-4 w-4"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<rect x="2" y="7" width="20" height="14" rx="2" />
		<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
	</svg>
);

const EyeIcon = ({ open }) =>
	open ? (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-4 w-4"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M3 3l18 18" />
			<path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
			<path d="M9.88 5.09A9.77 9.77 0 0 1 12 5c5 0 9 4.5 9 7a10.94 10.94 0 0 1-3.14 3.9M6.1 6.1C3.86 7.6 2 9.99 2 12c0 2.5 4 7 10 7a9.7 9.7 0 0 0 4.02-.87" />
		</svg>
	) : (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-4 w-4"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	);

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

export const LoginPage = () => {
	const [accountType, setAccountType] = useState("jobseeker");
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({ email: "", password: "" });

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// TODO: wire up authentication once the API is available
	};

	const tabClass = (type) =>
		`rounded-md py-2 text-sm font-semibold transition-colors cursor-pointer ${accountType === type
			? "bg-white text-gray-900 shadow-sm"
			: "text-gray-500 hover:text-gray-700"
		}`;

	return (
		<div className="min-h-screen w-full bg-base-200 flex items-center justify-center px-4 py-12">
			<Section>
				<div className="mx-auto w-full max-w-[420px] rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
					<div className="text-center">
						<h1 className="font-serif text-3xl font-bold text-[#020079]">
							Aruna
						</h1>
						<p className="mt-2 text-sm text-gray-500">
							Log in to your account to continue
						</p>
					</div>

					<div
						role="tablist"
						aria-label="Account type"
						className="mt-8 grid grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1"
					>
						<button
							type="button"
							role="tab"
							aria-selected={accountType === "jobseeker"}
							onClick={() => setAccountType("jobseeker")}
							className={tabClass("jobseeker")}
						>
							Job Seeker
						</button>
						<button
							type="button"
							role="tab"
							aria-selected={accountType === "employer"}
							onClick={() => setAccountType("employer")}
							className={tabClass("employer")}
						>
							Employer Partner
						</button>
					</div>

					<button
						type="button"
						className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50"
					>
						<BriefcaseIcon />
						Continue with LinkedIn
					</button>

					<div className="mt-6 flex items-center gap-3">
						<span className="h-px flex-1 bg-gray-200" />
						<span className="text-[11px] font-medium tracking-wide text-gray-400">
							OR LOG IN WITH EMAIL
						</span>
						<span className="h-px flex-1 bg-gray-200" />
					</div>

					<form onSubmit={handleSubmit} className="mt-6 space-y-5">
						<div>
							<label
								htmlFor="login-email"
								className="block text-sm font-medium text-gray-800"
							>
								Email Address
							</label>
							<input
								id="login-email"
								name="email"
								type="email"
								required
								autoComplete="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="name@company.com"
								className="mt-2 w-full border-0 border-b border-gray-300 bg-transparent py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-[#020079] focus:outline-none focus:ring-0"
							/>
						</div>

						<div>
							<label
								htmlFor="login-password"
								className="block text-sm font-medium text-gray-800"
							>
								Password
							</label>
							<div className="relative mt-2">
								<input
									id="login-password"
									name="password"
									type={showPassword ? "text" : "password"}
									required
									minLength={8}
									autoComplete="current-password"
									value={formData.password}
									onChange={handleChange}
									placeholder="••••••••"
									className="w-full border-0 border-b border-gray-300 bg-transparent py-2 pr-8 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-[#020079] focus:outline-none focus:ring-0"
								/>
								<button
									type="button"
									onClick={() => setShowPassword((v) => !v)}
									aria-label={showPassword ? "Hide password" : "Show password"}
									className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
								>
									<EyeIcon open={showPassword} />
								</button>
							</div>
						</div>


						<button
							type="submit"
							className="group mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#020079] py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#020079]/90"
						>
							LOG IN
							<ArrowIcon className="transition-transform group-hover:translate-x-1" />
						</button>
					</form>

					<p className="mt-8 text-center text-sm text-gray-500">
						Don&apos;t have an account?{" "}
						<Link
							to="/signup"
							className="font-medium text-[#020079] hover:underline"
						>
							Sign up here
						</Link>
					</p>
				</div>
			</Section>
		</div>
	);
};
