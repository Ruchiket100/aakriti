"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { heroSlides } from "./data";
import { ArrowRight } from "./Icons";

export function HeroCarousel() {
	const [current, setCurrent] = useState(0);
	const [paused, setPaused] = useState(false);
	const [direction, setDirection] = useState(1);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const total = heroSlides.length;

	const goTo = useCallback(
		(idx: number, dir: number) => {
			setDirection(dir);
			setCurrent(((idx % total) + total) % total);
		},
		[total],
	);

	useEffect(() => {
		if (paused) {
			if (timerRef.current) clearInterval(timerRef.current);
			return;
		}
		timerRef.current = setInterval(() => {
			setDirection(1);
			setCurrent((c) => (c + 1) % total);
		}, 4500);
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [paused, total]);

	const slide = heroSlides[current];

	const textVar = {
		enter: (d: number) => ({ opacity: 0, x: d > 0 ? 36 : -36 }),
		center: {
			opacity: 1,
			x: 0,
			transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as any },
		},
		exit: (d: number) => ({
			opacity: 0,
			x: d > 0 ? -36 : 36,
			transition: { duration: 0.3 },
		}),
	};
	const imgVar = {
		enter: (d: number) => ({
			opacity: 0,
			scale: 1.06,
			x: d > 0 ? 50 : -50,
		}),
		center: {
			opacity: 1,
			scale: 1,
			x: 0,
			transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as any },
		},
		exit: (d: number) => ({
			opacity: 0,
			scale: 0.97,
			x: d > 0 ? -50 : 50,
			transition: { duration: 0.35 },
		}),
	};

	return (
		<section
			className="relative w-full overflow-hidden bg-white"
			style={{ minHeight: "60vh" }}
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			{/* <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gray-100 z-20">
				{!paused && (
					<motion.div
						key={current}
						className="h-full bg-gray-900"
						initial={{ width: "0%" }}
						animate={{ width: "100%" }}
						transition={{ duration: 4.5, ease: "linear" }}
					/>
				)}
			</div> */}

			<div
				className="w-full h-full grid grid-cols-1 lg:grid-cols-2 max-w-none"
				style={{ minHeight: "60vh" }}
			>
				<div className="relative flex flex-col justify-center px-10 py-20 lg:px-20 overflow-hidden bg-white">
					<AnimatePresence custom={direction} mode="wait">
						<motion.div
							key={slide.id + "t"}
							custom={direction}
							variants={textVar}
							initial="enter"
							animate="center"
							exit="exit"
							className="flex flex-col"
						>
							<div className="flex items-center gap-3 mb-6">
								<span className="text-[10px] tracking-[0.22em] uppercase text-gray-400">
									{slide.category}
								</span>
								<span className="text-[9px] tracking-wide font-bold px-2.5 py-0.5 rounded-full bg-gray-900 text-white">
									{slide.tag}
								</span>
							</div>
							<h1
								className="text-5xl lg:text-6xl font-medium text-gray-900 leading-[1.1] tracking-tight mb-3"
								style={{ fontFamily: "Georgia, serif" }}
							>
								{slide.name}
							</h1>
							<p className="text-[12px] tracking-[0.1em] uppercase text-gray-400 mb-5">
								{slide.subtitle}
							</p>
							<p className="text-[15px] text-gray-500 leading-relaxed max-w-xs mb-8">
								{slide.desc}
							</p>
							<div className="flex items-center gap-5 mb-10">
								<span className="text-2xl font-medium text-gray-900">
									{slide.price}
								</span>
								<motion.button
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.97 }}
									className="px-7 py-3 rounded-full text-sm font-medium bg-gray-900 text-white"
								>
									{slide.cta}
								</motion.button>
								<motion.button
									whileHover={{ x: 3 }}
									transition={{
										type: "spring",
										stiffness: 400,
									}}
									className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
								>
									Details <ArrowRight />
								</motion.button>
							</div>
							<div className="flex items-center gap-8 pt-7 border-t border-gray-100">
								{slide.stat.map((s) => (
									<div key={s.l}>
										<p className="text-lg font-medium text-gray-900">
											{s.v}
										</p>
										<p className="text-[11px] text-gray-400 mt-0.5">
											{s.l}
										</p>
									</div>
								))}
							</div>
						</motion.div>
					</AnimatePresence>

					<div className="absolute bottom-10 left-10 lg:left-20 flex items-center gap-4">
						<motion.button
							onClick={() => goTo(current - 1, -1)}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="13"
								height="13"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								viewBox="0 0 24 24"
							>
								<path d="M15 18l-6-6 6-6" />
							</svg>
						</motion.button>
						<div className="flex gap-1.5">
							{heroSlides.map((_, i) => (
								<motion.button
									key={i}
									onClick={() =>
										goTo(i, i > current ? 1 : -1)
									}
									animate={{
										width: i === current ? 20 : 6,
										background:
											i === current ? "#111" : "#d1d5db",
									}}
									transition={{ duration: 0.3 }}
									className="h-[5px] rounded-full"
								/>
							))}
						</div>
						<motion.button
							onClick={() => goTo(current + 1, 1)}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="13"
								height="13"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								viewBox="0 0 24 24"
							>
								<path d="M9 18l6-6-6-6" />
							</svg>
						</motion.button>
					</div>
					<div className="absolute bottom-10 right-8 text-[11px] text-gray-400 tabular-nums">
						{String(current + 1).padStart(2, "0")} /{" "}
						{String(total).padStart(2, "0")}
					</div>
				</div>

				<div className="relative bg-gray-50 overflow-hidden">
					<AnimatePresence custom={direction} mode="wait">
						<motion.img
							key={slide.id + "i"}
							custom={direction}
							variants={imgVar}
							initial="enter"
							animate="center"
							exit="exit"
							src={slide.img}
							alt={slide.name}
							className="w-full h-full object-cover absolute inset-0"
						/>
					</AnimatePresence>
					<AnimatePresence mode="wait">
						<motion.div
							key={slide.id + "card"}
							initial={{ opacity: 0, y: 14 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.4, delay: 0.25 }}
							className="absolute bottom-8 left-8 bg-white/90 rounded-xl px-4 py-3 border border-gray-100"
						>
							<p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">
								{slide.category}
							</p>
							<p className="text-[13px] font-medium text-gray-900">
								{slide.name}
							</p>
							<p className="text-[12px] text-gray-500">
								{slide.price}
							</p>
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</section>
	);
}
