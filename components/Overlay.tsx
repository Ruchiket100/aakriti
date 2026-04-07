"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOverlay } from "@/store/overlayStore";

export default function Overlay() {
	const { overlay, closeOverlay } = useOverlay();
	const isOpen = !!overlay.content;

	useEffect(() => {
		document.body.style.overflow = isOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeOverlay();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [closeOverlay]);

		return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
					<motion.div
						key="backdrop"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="absolute inset-0 bg-black/40"
						style={{ backdropFilter: "blur(4px)" }}
						onClick={closeOverlay}
					/>
					<motion.div
						key="panel"
						initial={{ opacity: 0, scale: 0.94 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.96 }}
						transition={{
							duration: 0.38,
							ease: [0.22, 1, 0.36, 1],
						}}
						className="relative bg-white rounded-2xl overflow-hidden w-full max-w-[960px] max-h-[88vh] overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						<motion.button
							onClick={closeOverlay}
							whileHover={{ scale: 1.1, rotate: 90 }}
							whileTap={{ scale: 0.9 }}
							transition={{
								type: "spring",
								stiffness: 300,
								damping: 20,
							}}
							className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="15"
								height="15"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								viewBox="0 0 24 24"
							>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</motion.button>
						{overlay.content}
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
