"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { categories, fadeUp, stagger } from "./data";

export function CategoryStrip() {
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
					const targetHref =
						c.label === "Custom Order"
							? "/custom"
							: `/shop?category=${encodeURIComponent(c.label)}`;

					return (
						<Link key={c.id} href={targetHref} className="flex select-none">
							<motion.div
								variants={fadeUp}
								whileHover={{ y: -1 }}
								whileTap={{ scale: 0.97 }}
								className="relative flex items-center gap-1 px-6 py-4 transition-colors cursor-pointer"
							>
								<div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center text-[16px] font-medium transition-colors hover:bg-gray-100 hover:text-gray-900">
									{c.icon}
								</div>
								<div className="flex flex-col flex-start ml-2">
									<span className="text-[11px] font-medium tracking-wide whitespace-nowrap text-gray-500 hover:text-gray-900">
										{c.label}
									</span>
									<span className="text-[9px] text-gray-400 whitespace-nowrap">
										{c.count}
									</span>
								</div>
							</motion.div>
						</Link>
					);
				})}
			</motion.div>
		</section>
	);
}

