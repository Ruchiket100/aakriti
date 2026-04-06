"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "./Icons";

export function CTABanner1() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-40px" });
	return (
		<section
			ref={ref}
			className="w-full bg-gray-900 py-20 px-6 lg:px-16 overflow-hidden relative"
		>
			<div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5">
				<svg
					viewBox="0 0 300 300"
					className="w-full h-full"
					fill="none"
					stroke="white"
					strokeWidth="0.5"
				>
					{Array.from({ length: 10 }).map((_, i) => (
						<circle key={i} cx="300" cy="150" r={30 + i * 28} />
					))}
				</svg>
			</div>
			<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
				<motion.div
					initial={{ opacity: 0, x: -30 }}
					animate={inView ? { opacity: 1, x: 0 } : {}}
					transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
				>
					<p className="text-[11px] tracking-[0.22em] uppercase text-white/40 mb-3">
						Aakriti 3D Studio
					</p>
					<h2
						className="text-4xl lg:text-5xl font-medium text-white leading-[1.15] mb-5"
						style={{ fontFamily: "Georgia, serif" }}
					>
						Something made
						<br />
						<span className="text-white/40">just for you.</span>
					</h2>
					<p className="text-[15px] text-white/60 leading-relaxed max-w-sm mb-8">
						From a name plate to a full sculpture — describe your
						idea and we print it in 5–7 days. No minimums. No
						compromises.
					</p>
					<div className="flex items-center gap-4">
						<motion.button
							whileHover={{ scale: 1.04 }}
							whileTap={{ scale: 0.97 }}
							className="px-8 py-3 rounded-full text-sm font-medium bg-white text-gray-900"
						>
							Start Custom Order
						</motion.button>
						<motion.button
							whileHover={{ x: 3 }}
							transition={{ type: "spring", stiffness: 400 }}
							className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors"
						>
							See examples <ArrowRight />
						</motion.button>
					</div>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, x: 30 }}
					animate={inView ? { opacity: 1, x: 0 } : {}}
					transition={{
						duration: 0.6,
						delay: 0.15,
						ease: [0.22, 1, 0.36, 1] as any,
					}}
					className="grid grid-cols-3 gap-3"
				>
					{["Name Plaque", "Portrait Bust", "Logo Model"].map(
						(name, i) => (
							<div
								key={name}
								className="rounded-xl overflow-hidden border border-white/10 aspect-square relative"
							>
								<img
									src="https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"
									alt={name}
									className="w-full h-full object-cover opacity-60"
								/>
								<div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
									<p className="text-white text-[10px] font-medium">
										{name}
									</p>
									<p className="text-white/50 text-[9px]">
										From ₹{["800", "3,500", "1,200"][i]}
									</p>
								</div>
							</div>
						),
					)}
				</motion.div>
			</div>
		</section>
	);
}