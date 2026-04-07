"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOverlay } from "@/store/overlayStore";
import { buildWhatsAppURL } from "@/lib/whatsapp";
import type { Product } from "@/lib/supabase";

function StarIcon({ filled = true }: { filled?: boolean }) {
	return (
		<svg
			width="13"
			height="13"
			viewBox="0 0 24 24"
			fill={filled ? "#f59e0b" : "none"}
			stroke="#f59e0b"
			strokeWidth={filled ? 0 : 1.5}
		>
			<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
		</svg>
	);
}

const tagColors: Record<string, { bg: string; text: string }> = {
	Bestseller: { bg: "#fef3c7", text: "#92400e" },
	"Top Rated": { bg: "#fef3c7", text: "#92400e" },
	Popular: { bg: "#f3f4f6", text: "#374151" },
	New: { bg: "#dcfce7", text: "#15803d" },
	Trending: { bg: "#ede9fe", text: "#5b21b6" },
	Limited: { bg: "#fee2e2", text: "#991b1b" },
	Seasonal: { bg: "#fdf4ff", text: "#7e22ce" },
};

export default function ProductOverlay({ product }: { product: Product }) {
	const { closeOverlay } = useOverlay();
	const [selectedImg, setSelectedImg] = useState(0);
	const [qty, setQty] = useState(1);
	const [wishlisted, setWishlisted] = useState(false);

	const tag = tagColors[product.tag] ?? { bg: "#f3f4f6", text: "#374151" };
	const ratingNum = product.rating ?? 5;
	const images = product.images?.length
		? product.images
		: ["/placeholder.jpg"];
	const priceStr = product.price.toLocaleString("en-IN");

	function handleWhatsApp() {
		const url = buildWhatsAppURL({
			phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!,
			productName: product.name,
			category: product.category,
			price: priceStr,
			size: product.size,
			quantity: qty,
		});
		window.open(url, "_blank");
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 min-h-[540px]">
			{/* Images */}
			<div className="bg-gray-50 p-6 flex flex-col gap-4">
				<AnimatePresence mode="wait">
					<motion.div
						key={selectedImg}
						initial={{ opacity: 0, scale: 1.04 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.97 }}
						transition={{
							duration: 0.35,
							ease: [0.22, 1, 0.36, 1],
						}}
						className="relative rounded-xl overflow-hidden bg-white"
						style={{ aspectRatio: "1" }}
					>
						<img
							src={images[selectedImg]}
							alt={product.name}
							className="w-full h-full object-cover"
						/>
						<span
							className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
							style={{ background: tag.bg, color: tag.text }}
						>
							{product.tag}
						</span>
						{!product.in_stock && (
							<div className="absolute inset-0 bg-white/60 flex items-center justify-center">
								<span className="text-[13px] font-medium text-gray-500 border border-gray-300 px-4 py-1.5 rounded-full">
									Out of Stock
								</span>
							</div>
						)}
					</motion.div>
				</AnimatePresence>

				{images.length > 1 && (
					<div className="flex gap-2">
						{images.map((src, i) => (
							<motion.button
								key={i}
								onClick={() => setSelectedImg(i)}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.97 }}
								className="relative rounded-lg overflow-hidden flex-1 border-2 transition-colors"
								style={{
									aspectRatio: "1",
									borderColor:
										selectedImg === i
											? "#1a1a1a"
											: "transparent",
								}}
							>
								<img
									src={src}
									alt=""
									className="w-full h-full object-cover"
								/>
							</motion.button>
						))}
					</div>
				)}
			</div>

			{/* Details */}
			<div className="p-8 flex flex-col">
				<div className="flex items-center gap-2 mb-3">
					<span className="text-[10px] tracking-[0.18em] uppercase text-gray-400">
						{product.category}
					</span>
					<span className="text-gray-300">·</span>
					<span className="text-[10px] tracking-[0.18em] uppercase text-gray-400">
						Handmade
					</span>
				</div>

				<h2
					className="text-2xl font-medium text-gray-900 leading-tight mb-2"
					style={{ fontFamily: "Georgia, serif" }}
				>
					{product.name}
				</h2>

				<div className="flex items-center gap-2 mb-5">
					<div className="flex items-center gap-0.5">
						{Array.from({ length: 5 }).map((_, i) => (
							<StarIcon
								key={i}
								filled={i < Math.round(ratingNum)}
							/>
						))}
					</div>
					<span className="text-[12px] text-gray-500">
						reviews
						{/* {ratingNum?.toFixed(1)} · {product.reviews} reviews */}
					</span>
				</div>

				<div className="flex items-baseline gap-3 mb-5">
					<span className="text-3xl font-medium text-gray-900">
						₹{priceStr}
					</span>
					<span className="text-[12px] text-gray-400">
						incl. of all taxes
					</span>
				</div>

				<p className="text-[14px] text-gray-500 leading-relaxed mb-6">
					{product.description}
				</p>

				<div className="grid grid-cols-3 gap-3 mb-7">
					{[
						{ label: "Size", value: product.size },
						{ label: "Material", value: product.material },
						{ label: "Delivery", value: product.delivery_days },
					].map((s) => (
						<div
							key={s.label}
							className="bg-gray-50 rounded-xl p-3 text-center"
						>
							<p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
								{s.label}
							</p>
							<p className="text-[13px] font-medium text-gray-800">
								{s.value}
							</p>
						</div>
					))}
				</div>

				{/* Qty */}
				<div className="flex items-center gap-3 mb-6">
					<span className="text-[12px] text-gray-500 w-16">
						Quantity
					</span>
					<div className="flex items-center border border-gray-200 rounded-full">
						<motion.button
							whileTap={{ scale: 0.85 }}
							onClick={() => setQty((q) => Math.max(1, q - 1))}
							className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 text-lg"
						>
							−
						</motion.button>
						<span className="w-9 text-center text-[14px] font-medium text-gray-900">
							{qty}
						</span>
						<motion.button
							whileTap={{ scale: 0.85 }}
							onClick={() => setQty((q) => q + 1)}
							className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 text-lg"
						>
							+
						</motion.button>
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-3 mt-auto">
					<motion.button
						onClick={handleWhatsApp}
						disabled={!product.in_stock}
						whileHover={product.in_stock ? { scale: 1.02 } : {}}
						whileTap={product.in_stock ? { scale: 0.97 } : {}}
						className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-full text-[13px] font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
						style={{ background: "#25D366" }}
					>
						{/* WhatsApp icon */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="17"
							height="17"
							viewBox="0 0 24 24"
							fill="white"
						>
							<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
						</svg>
						{product.in_stock
							? `Order on WhatsApp`
							: "Out of Stock"}
					</motion.button>

					<motion.button
						onClick={() => setWishlisted((w) => !w)}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						animate={{
							borderColor: wishlisted ? "#f59e0b" : "#e5e7eb",
						}}
						className="w-12 h-12 rounded-full border flex items-center justify-center"
					>
						<motion.svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							animate={{
								fill: wishlisted ? "#f59e0b" : "none",
								stroke: wishlisted ? "#f59e0b" : "#9ca3af",
							}}
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M12 21C12 21 3 14 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14 14 21 12 21Z" />
						</motion.svg>
					</motion.button>

					{/* Share via WhatsApp */}
					<motion.button
						onClick={handleWhatsApp}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-colors"
						title="Share on WhatsApp"
					>
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
							<circle cx="18" cy="5" r="3" />
							<circle cx="6" cy="12" r="3" />
							<circle cx="18" cy="19" r="3" />
							<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
							<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
						</svg>
					</motion.button>
				</div>

				<div className="mt-5 flex items-center gap-2 text-[11px] text-gray-400">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="12"
						height="12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						viewBox="0 0 24 24"
					>
						<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
					</svg>
					Handcrafted & quality-checked · Orders confirmed via
					WhatsApp
				</div>
			</div>
		</div>
	);
}
