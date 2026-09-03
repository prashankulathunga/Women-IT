const footerLinks = [
	"About",
	"Privacy Policy",
	"Terms of Service",
	"Partner with Us",
	"Contact",
];

export const Footer = () => {
	const year = new Date().getFullYear();

	return (
		<footer className="border-t border-gray-200 bg-[#F1F0EC]">
			<div className="mx-auto w-full max-w-7xl px-4 py-8">
				<div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
					<p className="text-sm text-gray-500">
						<span className="font-serif text-base font-bold text-[#020079]">
							Aruna
						</span>{" "}
						© {year} Aruna. Empowering Women in Sri Lankan IT.
					</p>

					<ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
						{footerLinks.map((label) => (
							<li key={label} className="cursor-default">
								{label}
							</li>
						))}
					</ul>
				</div>
			</div>
		</footer>
	);
};
