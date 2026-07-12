"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useProducts } from "@/hooks/useQueries";
import { trendingProducts, fadeUp, stagger } from "./data";
import { ProductCard } from "./ProductCard";
import { SectionHeader } from "./SectionHeader";

export function TrendingProducts() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-60px" });
	const { data: liveProducts } = useProducts();

	// Filter for trending, new, or seasonal items if live data exists
	const filteredLive = liveProducts
		? liveProducts.filter(
				(p) =>
					p.tag === "Trending" ||
					p.tag === "New" ||
					p.tag === "Seasonal",
			)
		: [];

	// Fallback to any live products, or the original mock products
	const displayProducts =
		filteredLive.length > 0
			? filteredLive.slice(0, 4)
			: liveProducts && liveProducts.length > 0
				? liveProducts.slice(0, 4)
				: trendingProducts;

	const hasMore = liveProducts && liveProducts.length > 0
		? (filteredLive.length > 0 ? filteredLive.length > 4 : liveProducts.length > 4)
		: trendingProducts.length > 4;

	const viewAllHref = hasMore ? "/shop?tag=Trending" : undefined;

	return (
		<section ref={ref} className="w-full bg-gray-50 py-16 px-6 lg:px-16">
			<div className="max-w-7xl mx-auto">
				<motion.div
					variants={stagger as any}
					initial="hidden"
					animate={inView ? "show" : "hidden"}
				>
					<motion.div variants={fadeUp as any}>
						<SectionHeader eyebrow="Right now" title="Trending" href={viewAllHref} />
					</motion.div>
					<motion.div
						variants={stagger as any}
						className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
					>
						{displayProducts.map((p) => (
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