"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 10);
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<motion.header
			animate={{
				boxShadow: scrolled ? "0 1px 0 #e5e7eb" : "0 1px 0 #f3f4f6",
			}}
			className="sticky top-0 z-50 bg-white w-full"
		>
			<div className="max-w-7xl mx-auto px-6 lg:px-16 h-14 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="text-[12px] tracking-[0.25em] uppercase font-medium text-gray-900">
						Aakriti
					</span>
					<span className="w-px h-3 bg-gray-300" />
					<span className="text-[12px] tracking-[0.15em] uppercase text-gray-400">
						3D Studio
					</span>
				</div>

				<nav className="hidden md:flex items-center gap-7">
					{[
						"Shop",
						"Collections",
						"Custom Order",
						"About",
						"Contact",
					].map((item) => (
						<motion.a
							key={item}
							href="#"
							whileHover={{ y: -1 }}
							className="text-[12px] tracking-wide text-gray-500 hover:text-gray-900 transition-colors"
						>
							{item}
						</motion.a>
					))}
				</nav>

				<div className="flex items-center gap-4">
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						className="text-gray-500 hover:text-gray-900 transition-colors hidden sm:flex"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							viewBox="0 0 24 24"
						>
							<circle cx="11" cy="11" r="8" />
							<path d="M21 21l-4.35-4.35" />
						</svg>
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						className="relative text-gray-500 hover:text-gray-900 transition-colors"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							viewBox="0 0 24 24"
						>
							<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
							<line x1="3" y1="6" x2="21" y2="6" />
							<path d="M16 10a4 4 0 01-8 0" />
						</svg>
						<span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-gray-900 rounded-full text-white text-[8px] flex items-center justify-center font-medium">
							2
						</span>
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.97 }}
						className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium px-4 py-2 bg-gray-900 text-white rounded-full"
					>
						Custom Order
					</motion.button>
					<button
						onClick={() => setMenuOpen(!menuOpen)}
						className="md:hidden text-gray-500"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							viewBox="0 0 24 24"
						>
							{menuOpen ? (
								<>
									<line x1="18" y1="6" x2="6" y2="18" />
									<line x1="6" y1="6" x2="18" y2="18" />
								</>
							) : (
								<>
									<line x1="3" y1="12" x2="21" y2="12" />
									<line x1="3" y1="6" x2="21" y2="6" />
									<line x1="3" y1="18" x2="21" y2="18" />
								</>
							)}
						</svg>
					</button>
				</div>
			</div>

			<AnimatePresence>
				{menuOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="md:hidden bg-white border-t border-gray-100 px-6 overflow-hidden"
					>
						{[
							"Shop",
							"Collections",
							"Custom Order",
							"About",
							"Contact",
						].map((item) => (
							<a
								key={item}
								href="#"
								className="block py-3 text-[13px] text-gray-600 border-b border-gray-50"
							>
								{item}
							</a>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.header>
	);
}