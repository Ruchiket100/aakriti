"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "./Icons";

export function CTABanner2() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-40px" });
	return (
		<section
			ref={ref}
			className="w-full bg-gray-50 border-t border-b border-gray-100 py-20 px-6 lg:px-16"
		>
			<motion.div
				initial={{ opacity: 0, y: 24 }}
				animate={inView ? { opacity: 1, y: 0 } : {}}
				transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
				className="max-w-3xl mx-auto text-center"
			>
				<p className="text-[11px] tracking-[0.22em] uppercase text-gray-400 mb-4">
					Handcrafted, always
				</p>
				<h2
					className="text-4xl lg:text-5xl font-medium text-gray-900 leading-[1.2] mb-5"
					style={{ fontFamily: "Georgia, serif" }}
				>
					Every piece is printed,
					<br />
					finished by hand.
				</h2>
				<p className="text-[15px] text-gray-500 leading-relaxed mb-8 max-w-xl mx-auto">
					We don't mass-produce. Each order is printed fresh,
					hand-finished, and quality-checked before it reaches you.
				</p>
				<div className="flex items-center justify-center gap-4">
					<motion.button
						whileHover={{ scale: 1.04 }}
						whileTap={{ scale: 0.97 }}
						className="px-8 py-3 rounded-full text-sm font-medium bg-gray-900 text-white"
					>
						Shop the Collection
					</motion.button>
					<motion.button
						whileHover={{ x: 3 }}
						transition={{ type: "spring", stiffness: 400 }}
						className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
					>
						Our process <ArrowRight />
					</motion.button>
				</div>

				<div className="mt-12 flex items-center justify-center gap-8 flex-wrap">
					{[
						{ icon: "◎", label: "100% 3D Printed" },
						{ icon: "◇", label: "Hand finished" },
						{ icon: "❋", label: "Eco filament" },
						{ icon: "◈", label: "Ships in 5 days" },
					].map((b) => (
						<div key={b.label} className="flex items-center gap-2">
							<span className="text-[16px] text-gray-400">
								{b.icon}
							</span>
							<span className="text-[12px] text-gray-500">
								{b.label}
							</span>
						</div>
					))}
				</div>
			</motion.div>
		</section>
	);
}