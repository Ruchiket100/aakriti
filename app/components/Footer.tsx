"use client";

import { motion } from "framer-motion";

export function Footer() {
	return (
		<footer className="w-full bg-gray-900 text-white px-6 lg:px-16 pt-16 pb-8">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-14">
					<div className="col-span-2">
						<div className="flex items-center gap-2 mb-4">
							<span className="text-[13px] tracking-[0.25em] uppercase font-medium">
								Aakriti
							</span>
							<span className="w-px h-3 bg-white/20" />
							<span className="text-[13px] tracking-[0.15em] uppercase text-white/40">
								3D Studio
							</span>
						</div>
						<p className="text-[13px] text-white/50 leading-relaxed mb-5 max-w-xs">
							Precision 3D printed home decor, lamps, idols, and
							custom pieces — handcrafted in India, shipped across
							the country.
						</p>
						<div className="flex items-center gap-3">
							{[
								{
									href: "#",
									icon: (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="15"
											height="15"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
											viewBox="0 0 24 24"
										>
											<rect
												x="2"
												y="2"
												width="20"
												height="20"
												rx="5"
												ry="5"
											/>
											<circle cx="12" cy="12" r="4" />
											<circle
												cx="17.5"
												cy="6.5"
												r="1.5"
												fill="currentColor"
												stroke="none"
											/>
										</svg>
									),
								},
								{
									href: "#",
									icon: (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="15"
											height="15"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
											viewBox="0 0 24 24"
										>
											<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
										</svg>
									),
								},
								{
									href: "#",
									icon: (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="15"
											height="15"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
											viewBox="0 0 24 24"
										>
											<path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
											<polygon
												points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
												fill="currentColor"
												stroke="none"
											/>
										</svg>
									),
								},
							].map((s, i) => (
								<motion.a
									key={i}
									href={s.href}
									whileHover={{ scale: 1.15 }}
									whileTap={{ scale: 0.9 }}
									className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-colors"
								>
									{s.icon}
								</motion.a>
							))}
						</div>
					</div>

					{[
						{
							heading: "Shop",
							links: [
								"All Products",
								"Lamps",
								"Home Decor",
								"Car Decor",
								"Keychains",
							],
						},
						{
							heading: "More",
							links: [
								"Devotional",
								"Miniature",
								"Custom Order",
								"New Arrivals",
								"Sale",
							],
						},
						{
							heading: "Info",
							links: [
								"About Us",
								"Our Process",
								"Shipping Policy",
								"Returns",
								"Contact Us",
							],
						},
					].map((col) => (
						<div key={col.heading}>
							<p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-4">
								{col.heading}
							</p>
							<ul className="space-y-2.5">
								{col.links.map((l) => (
									<li key={l}>
										<motion.a
											href="#"
											whileHover={{ x: 2 }}
											className="text-[13px] text-white/50 hover:text-white/80 transition-colors block"
										>
											{l}
										</motion.a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="border-t border-white/10 pt-10 mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
					<div>
						<p className="text-[13px] font-medium text-white mb-1">
							Stay in the loop
						</p>
						<p className="text-[12px] text-white/40">
							New drops, offers, and behind-the-scenes — straight
							to your inbox.
						</p>
					</div>
					<div className="flex items-center gap-2">
						<input
							type="email"
							placeholder="your@email.com"
							className="flex-1 bg-white/10 border border-white/15 text-white text-[13px] placeholder-white/30 px-4 py-2.5 rounded-full outline-none focus:border-white/40 transition-colors"
						/>
						<motion.button
							whileHover={{ scale: 1.04 }}
							whileTap={{ scale: 0.97 }}
							className="px-5 py-2.5 rounded-full text-[13px] font-medium bg-white text-gray-900 whitespace-nowrap"
						>
							Subscribe
						</motion.button>
					</div>
				</div>

				<div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
					<p className="text-[11px] text-white/30">
						© 2025 Aakriti 3D Studio. All rights reserved.
					</p>
					<div className="flex items-center gap-5">
						{["Privacy Policy", "Terms of Use", "Sitemap"].map(
							(l) => (
								<a
									key={l}
									href="#"
									className="text-[11px] text-white/30 hover:text-white/60 transition-colors"
								>
									{l}
								</a>
							),
						)}
					</div>
				</div>
			</div>
		</footer>
	);
}