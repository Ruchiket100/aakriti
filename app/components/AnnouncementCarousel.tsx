"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { announcements } from "./data";
import { ArrowRight } from "./Icons";

export function AnnouncementCarousel() {
	const [current, setCurrent] = useState(0);
	const [paused, setPaused] = useState(false);
	const [direction, setDirection] = useState(1);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const total = announcements.length;

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
		}, 3500);
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [paused, total]);

	const slide = announcements[current];

	const variants = {
		enter: (d: number) => ({ x: d > 0 ? 30 : -30, opacity: 0 }),
		center: {
			x: 0,
			opacity: 1,
			transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
		},
		exit: (d: number) => ({
			x: d > 0 ? -30 : 30,
			opacity: 0,
			transition: { duration: 0.25 },
		}),
	} as const;

	return (
		<div
			className="relative w-full overflow-hidden"
			style={{ background: "#1a1a1a", height: 40 }}
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			<div className="absolute top-0 left-0 right-0 h-[1px] bg-white/10">
				{!paused && (
					<motion.div
						key={current}
						className="h-full bg-white/40"
						initial={{ width: "0%" }}
						animate={{ width: "100%" }}
						transition={{ duration: 3.5, ease: "linear" }}
					/>
				)}
			</div>

			<div className="h-full flex items-center justify-center px-14">
				<AnimatePresence custom={direction} mode="wait">
					<motion.div
						key={current}
						custom={direction}
						variants={variants}
						initial="enter"
						animate="center"
						exit="exit"
						className="absolute flex items-center gap-3"
					>
						<motion.span
							initial={{ opacity: 0, scale: 0.85 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.1 }}
							className="hidden sm:inline text-[9px] font-bold tracking-[0.2em] text-white/50 border border-white/20 px-2 py-0.5 rounded-full"
						>
							{slide.label}
						</motion.span>
						<span className="text-[12px] text-white/90 font-medium">
							{slide.text}
						</span>
						<motion.button
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.15 }}
							whileHover={{ scale: 1.04 }}
							className="text-[11px] font-semibold text-white underline underline-offset-2 decoration-dotted flex items-center gap-1"
						>
							{slide.cta} <ArrowRight size={10} />
						</motion.button>
					</motion.div>
				</AnimatePresence>
			</div>

			<button
				onClick={() => goTo(current - 1, -1)}
				className="absolute left-3 inset-y-0 flex items-center text-white/40 hover:text-white/80 transition-colors"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					viewBox="0 0 24 24"
				>
					<path d="M15 18l-6-6 6-6" />
				</svg>
			</button>
			<button
				onClick={() => goTo(current + 1, 1)}
				className="absolute right-3 inset-y-0 flex items-center text-white/40 hover:text-white/80 transition-colors"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					viewBox="0 0 24 24"
				>
					<path d="M9 18l6-6-6-6" />
				</svg>
			</button>

			<div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
				{announcements.map((_, i) => (
					<motion.button
						key={i}
						onClick={() => goTo(i, i > current ? 1 : -1)}
						animate={{
							width: i === current ? 12 : 3,
							background:
								i === current
									? "#fff"
									: "rgba(255,255,255,0.3)",
						}}
						className="h-[3px] rounded-full"
					/>
				))}
			</div>
		</div>
	);
}