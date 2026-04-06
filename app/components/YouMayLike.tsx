"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { youMayLike, fadeUp, stagger } from "./data";
import { ProductCard } from "./ProductCard";
import { SectionHeader } from "./SectionHeader";

export function YouMayLike() {
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
							eyebrow="Picked for you"
							title="You may like"
						/>
					</motion.div>
					<motion.div
						variants={stagger as any}
						className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
					>
						{youMayLike.map((p) => (
							<motion.div key={p.id} variants={fadeUp as any}>
								<ProductCard p={p} />
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}