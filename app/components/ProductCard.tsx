"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Product, tagColors } from "./data";
import { StarIcon } from "./Icons";

export function ProductCard({ p }: { p: Product }) {
	const [hovered, setHovered] = useState(false);
	const tag = tagColors[p.tag] ?? { bg: "#f3f4f6", text: "#374151" };

	return (
		<motion.div
			onHoverStart={() => setHovered(true)}
			onHoverEnd={() => setHovered(false)}
			animate={{ y: hovered ? -5 : 0 }}
			transition={{ type: "spring", stiffness: 300, damping: 22 }}
			className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer"
		>
			<div
				className="relative overflow-hidden"
				style={{ aspectRatio: "4/3" }}
			>
				<motion.img
					src={p.img}
					alt={p.name}
					className="w-full h-full object-cover"
					animate={{ scale: hovered ? 1.07 : 1 }}
					transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
				/>
				<span
					className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
					style={{ background: tag.bg, color: tag.text }}
				>
					{p.tag}
				</span>
				<motion.button
					className="absolute bottom-0 left-0 right-0 py-3 text-[13px] font-medium text-white bg-gray-900"
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
					transition={{ duration: 0.2 }}
					whileTap={{ scale: 0.98 }}
				>
					Buy Now
				</motion.button>
			</div>
			<div className="px-4 py-3">
				<p className="text-[11px] text-gray-400 mb-0.5 uppercase tracking-wide">
					{p.cat}
				</p>
				<p className="text-[13px] font-medium text-gray-900 leading-snug mb-1">
					{p.name}
				</p>
				<div className="flex items-center justify-between">
					<p className="text-[14px] font-medium text-gray-900">
						{p.price}
					</p>
					<div className="flex items-center gap-1">
						<StarIcon />
						<span className="text-[11px] text-gray-400">
							{p.rating} ({p.reviews})
						</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
}