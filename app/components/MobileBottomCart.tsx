"use client";

import { useState } from "react";
import { useCart } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";

export function MobileBottomCart() {
	const { cart, totalPrice, totalItems, removeFromCart } = useCart();
	const [expanded, setExpanded] = useState(false);

	if (totalItems === 0) return null;

	function handleWhatsAppCheckout() {
		const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
		const lines = [
			`Hi Aakriti 👋! I want to order the following items from my cart:`,
			``,
			...cart.map(
				(item, idx) =>
					`${idx + 1}. *${item.product.name}*` +
					`\n   📐 Size: ${item.size || "Standard"}` +
					`\n   🎨 Color: ${item.color || "Default"}` +
					`\n   🧱 Material: ${item.product.material || "PLA"}` +
					`\n   🔢 Qty: ${item.quantity}` +
					`\n   💰 Price: ₹${(item.product.price * item.quantity).toLocaleString("en-IN")}`
			),
			``,
			`*Grand Total:* ₹${totalPrice.toLocaleString("en-IN")}`,
			``,
			`Please confirm my order. Thank you!`,
		];
		const message = encodeURIComponent(lines.join("\n"));
		window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
	}

	return (
		<div className="fixed bottom-4 left-4 right-4 z-40 md:hidden font-sans select-none">
			<AnimatePresence>
				{expanded ? (
					/* Expanded Sheet Overlay */
					<motion.div
						key="expanded-sheet"
						initial={{ y: 150, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 150, opacity: 0 }}
						transition={{ type: "spring", damping: 25, stiffness: 220 }}
						className="bg-white rounded-3xl border border-gray-150 shadow-xl overflow-hidden p-6 flex flex-col gap-4 max-h-[70vh]"
					>
						{/* Sheet Header */}
						<div className="flex items-center justify-between pb-3 border-b border-gray-100">
							<div>
								<h3 className="text-[13px] font-bold text-gray-900">Your Cart</h3>
								<p className="text-[10px] text-gray-400 mt-0.5">
									{totalItems} items selected
								</p>
							</div>
							<button
								onClick={() => setExpanded(false)}
								className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-semibold cursor-pointer"
							>
								✕
							</button>
						</div>

						{/* Simple cart items list */}
						<div className="flex-1 overflow-y-auto space-y-3 max-h-[30vh] scrollbar-none pr-1">
							{cart.map((item, idx) => (
								<div
									key={idx}
									className="flex gap-3 items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100"
								>
									<div className="flex gap-2.5 items-center min-w-0">
										<img
											src={
												item.product.images?.[0] ||
												"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg"
											}
											alt=""
											className="w-10 h-10 object-cover rounded-lg border border-gray-150 flex-shrink-0"
										/>
										<div className="min-w-0">
											<h4 className="text-[11px] font-semibold text-gray-900 truncate max-w-[140px]">
												{item.product.name}
											</h4>
											<p className="text-[9px] text-gray-400">Qty: {item.quantity}</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<span className="text-[11px] font-bold text-gray-955">
											₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
										</span>
										<button
											onClick={() =>
												removeFromCart(item.product.id, item.size, item.color)
											}
											className="text-[10px] text-red-500 font-medium px-1.5 py-0.5 rounded hover:bg-red-50 cursor-pointer"
										>
											✕
										</button>
									</div>
								</div>
							))}
						</div>

						{/* Bottom Checkout Actions */}
						<div className="border-t border-gray-100 pt-3.5 flex flex-col gap-3">
							<div className="flex justify-between items-center text-[12px] font-medium text-gray-900">
								<span>Subtotal</span>
								<span className="text-[14px] font-bold">
									₹{totalPrice.toLocaleString("en-IN")}
								</span>
							</div>

							<div className="flex gap-2">
								<button
									onClick={() => setExpanded(false)}
									className="flex-1 py-2.5 border border-gray-200 rounded-full text-[11px] font-semibold text-gray-600 cursor-pointer"
								>
									Minimize
								</button>
								<button
									onClick={handleWhatsAppCheckout}
									className="flex-1 py-2.5 text-[11px] font-semibold text-white rounded-full bg-[#25D366] flex items-center justify-center gap-1.5 shadow-sm shadow-[#25d366]/20 cursor-pointer"
								>
									💬 WhatsApp Checkout
								</button>
							</div>
						</div>
					</motion.div>
				) : (
					/* Floating Slim Pill (collapsed) */
					<motion.div
						key="collapsed-pill"
						initial={{ y: 50, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 50, opacity: 0 }}
						onClick={() => setExpanded(true)}
						className="bg-gray-900 text-white shadow-lg border border-gray-800 py-3.5 px-6 rounded-full flex items-center justify-between cursor-pointer hover:bg-gray-850 transition-all"
					>
						<div className="flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="15"
								height="15"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								viewBox="0 0 24 24"
							>
								<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
								<line x1="3" y1="6" x2="21" y2="6" />
								<path d="M16 10a4 4 0 01-8 0" />
							</svg>
							<span className="text-[12px] font-bold tracking-wide">
								Bag ({totalItems})
							</span>
						</div>
						<div className="flex items-center gap-1.5">
							<span className="text-[12px] font-semibold opacity-90">
								₹{totalPrice.toLocaleString("en-IN")}
							</span>
							<span className="text-[10px] opacity-60">View →</span>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
