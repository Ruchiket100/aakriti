"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "./Icons";

export function SectionHeader({
	eyebrow,
	title,
	linkLabel = "View all",
	href,
}: {
	eyebrow: string;
	title: string;
	linkLabel?: string;
	href?: string;
}) {
	return (
		<div className="flex items-end justify-between mb-8">
			<div>
				<p className="text-[11px] tracking-[0.2em] uppercase text-gray-400 mb-1">
					{eyebrow}
				</p>
				<h2
					className="text-2xl font-medium text-gray-900"
					style={{ fontFamily: "Georgia, serif" }}
				>
					{title}
				</h2>
			</div>
			{href && (
				<Link href={href}>
					<motion.button
						whileHover={{ x: 3 }}
						transition={{ type: "spring", stiffness: 400 }}
						className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
					>
						{linkLabel} <ArrowRight />
					</motion.button>
				</Link>
			)}
		</div>
	);
}