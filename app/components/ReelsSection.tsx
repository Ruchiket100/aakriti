"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { reels, fadeUp, stagger } from "./data";
import { SectionHeader } from "./SectionHeader";

export function ReelsSection() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-60px" });

	return (
		<section ref={ref} className="w-full bg-white py-16 px-6 lg:px-16">
			<div className="max-w-7xl mx-auto">
				<motion.div
					variants={stagger as any}
					initial="hidden"
					animate={inView ? "show" : "hidden"}
				>
					<motion.div variants={fadeUp as any}>
						<SectionHeader
							eyebrow="As seen on reels"
							title="Customers love it"
							linkLabel="Follow us"
						/>
					</motion.div>

					<motion.div
						variants={stagger as any}
						className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
					>
						{reels.map((r, i) => (
							<motion.div
								key={r.id}
								variants={fadeUp as any}
								whileHover={{ y: -4, scale: 1.02 }}
								transition={{
									type: "spring",
									stiffness: 280,
									damping: 20,
								}}
								className="relative rounded-2xl overflow-hidden cursor-pointer border border-gray-100 bg-gray-50 group"
								style={{ aspectRatio: "9/16" }}
							>
								<img
									src="https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"
									alt={r.label}
									className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

								<div className="absolute inset-0 flex items-center justify-center">
									<motion.div
										initial={{ scale: 0.8, opacity: 0 }}
										whileInView={{ scale: 1, opacity: 1 }}
										transition={{
											delay: i * 0.07,
											duration: 0.4,
										}}
										className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center group-hover:bg-white/40 transition-colors"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											fill="white"
											viewBox="0 0 24 24"
										>
											<path d="M5 3l14 9-14 9V3z" />
										</svg>
									</motion.div>
								</div>

								<div className="absolute bottom-0 left-0 right-0 p-3">
									<p className="text-white text-[10px] font-semibold mb-0.5">
										{r.user}
									</p>
									<p className="text-white/70 text-[9px] leading-snug mb-2">
										{r.label}
									</p>
									<div className="flex items-center gap-3">
										<span className="flex items-center gap-1 text-white/60 text-[9px]">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="9"
												height="9"
												fill="white"
												viewBox="0 0 24 24"
											>
												<path d="M12 21C12 21 3 14 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14 14 21 12 21Z" />
											</svg>
											{r.likes}
										</span>
										<span className="flex items-center gap-1 text-white/60 text-[9px]">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="9"
												height="9"
												fill="none"
												stroke="white"
												strokeWidth="2"
												viewBox="0 0 24 24"
											>
												<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
												<circle cx="12" cy="12" r="3" />
											</svg>
											{r.views}
										</span>
									</div>
								</div>
							</motion.div>
						))}
					</motion.div>

					<motion.div
						variants={fadeUp as any}
						className="mt-8 flex justify-center"
					>
						<motion.button
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
							className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 text-[12px] font-medium text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
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
									r="1"
									fill="currentColor"
									stroke="none"
								/>
							</svg>
							Follow @aakriti3dstudio on Instagram
						</motion.button>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}