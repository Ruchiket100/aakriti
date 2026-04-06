"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { categories, fadeUp, stagger } from "./data";

export function CategoryStrip() {
	const [active, setActive] = useState<string | null>(null);
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-40px" });

	return (
		<section
			ref={ref}
			className="w-full bg-white border-b border-gray-100 overflow-x-auto"
		>
			<motion.div
				variants={stagger}
				initial="hidden"
				animate={inView ? "show" : "hidden"}
				className="flex items-stretch min-w-max max-w-7xl mx-auto px-6 lg:px-16"
			>
				{categories.map((c) => {
					const isActive = active === c.id;
					return (
						<motion.button
							key={c.id}
							variants={fadeUp}
							onClick={() => setActive(isActive ? null : c.id)}
							whileHover={{ y: -1 }}
							whileTap={{ scale: 0.97 }}
							className="relative flex items-center gap-1 px-6 py-4 transition-colors"
						>
							<motion.div
								animate={{
									background: isActive
										? "#1a1a1a"
										: "#f9fafb",
									color: isActive ? "#fff" : "#6b7280",
								}}
								className="w-10 h-10 rounded-xl flex items-center justify-center text-[16px] font-medium transition-colors"
							>
								{c.icon}
							</motion.div>
							<motion.div className="flex flex-col flex-start">
								<span
									className="text-[11px] font-medium tracking-wide whitespace-nowrap"
									style={{
										color: isActive ? "#111" : "#6b7280",
									}}
								>
									{c.label}
								</span>
								<span className="text-[9px] text-gray-400 whitespace-nowrap">
									{c.count}
								</span>
							</motion.div>
							<motion.div
								layoutId="cat-line"
								className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gray-900"
								animate={{ opacity: isActive ? 1 : 0 }}
							/>
						</motion.button>
					);
				})}
			</motion.div>
		</section>
	);
}
