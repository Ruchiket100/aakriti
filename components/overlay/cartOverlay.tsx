"use client";

import { useCart } from "@/store/cartStore";
import { useOverlay } from "@/store/overlayStore";
import { motion } from "framer-motion";

export default function CartOverlay() {
	const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
	const { closeOverlay } = useOverlay();

	function handleCheckout() {
		const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
		const lines = [
			`Hi Aakriti 👋! I would like to place an order for the following items:`,
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
			`Please confirm availability and sharing shipping details. Thanks!`,
		];
		const message = encodeURIComponent(lines.join("\n"));
		window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
	}

	return (
		<div className="p-6 md:p-8 flex flex-col max-h-[80vh] font-sans">
			{/* Header */}
			<div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
				<div>
					<h2
						className="text-2xl font-medium text-gray-900 leading-tight"
						style={{ fontFamily: "Georgia, serif" }}
					>
						Your Bag
					</h2>
					<p className="text-[11px] text-gray-400 mt-1">
						You have {totalItems} items in your bag
					</p>
				</div>
			</div>

			{/* Items list */}
			{cart.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<svg
						className="w-12 h-12 text-gray-300 mb-4"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						viewBox="0 0 24 24"
					>
						<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
						<line x1="3" y1="6" x2="21" y2="6" />
						<path d="M16 10a4 4 0 01-8 0" />
					</svg>
					<h3 className="text-sm font-semibold text-gray-800">Your bag is empty</h3>
					<p className="text-[11px] text-gray-400 mt-1 max-w-[200px]">
						Add items from our catalog to get started.
					</p>
					<button
						onClick={closeOverlay}
						className="mt-6 px-5 py-2 border border-gray-200 rounded-full text-[11px] font-semibold text-gray-650 hover:border-gray-450 hover:text-gray-900 transition-all cursor-pointer"
					>
						Start Shopping
					</button>
				</div>
			) : (
				<>
					<div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[48vh] scrollbar-none">
						{cart.map((item, idx) => {
							const itemPriceTotal = item.product.price * item.quantity;
							const imageSrc =
								item.product.images?.[0] ||
								"https://i.pinimg.com/736x/ef/4a/fb/ef4afb6c44b3ce31a3778e4409db8b2c.jpg";

							return (
								<div
									key={`${item.product.id}-${item.size}-${item.color}-${idx}`}
									className="flex gap-4 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-all"
								>
									{/* Thumbnail */}
									<img
										src={imageSrc}
										alt={item.product.name}
										className="w-16 h-16 rounded-lg object-cover border border-gray-150 flex-shrink-0"
									/>

									{/* Details */}
									<div className="flex-1 flex flex-col justify-between">
										<div className="flex justify-between items-start">
											<div>
												<h4 className="text-[13px] font-semibold text-gray-900 line-clamp-1">
													{item.product.name}
												</h4>
												<p className="text-[10px] text-gray-400 mt-0.5">
													{item.size || "Standard"} · {item.color || "Default"}
												</p>
											</div>
											<button
												onClick={() =>
													removeFromCart(item.product.id, item.size, item.color)
												}
												className="text-[11px] text-gray-400 hover:text-red-500 font-medium transition-colors"
											>
												Remove
											</button>
										</div>

										<div className="flex items-end justify-between mt-2">
											{/* Quantity control */}
											<div className="flex items-center border border-gray-200 bg-white rounded-full scale-90 -ml-1">
												<button
													onClick={() =>
														updateQuantity(
															item.product.id,
															item.quantity - 1,
															item.size,
															item.color
														)
													}
													className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 text-sm"
												>
													−
												</button>
												<span className="w-6 text-center text-[12px] font-medium text-gray-800">
													{item.quantity}
												</span>
												<button
													onClick={() =>
														updateQuantity(
															item.product.id,
															item.quantity + 1,
															item.size,
															item.color
														)
													}
													className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 text-sm"
												>
													+
												</button>
											</div>

											{/* Price */}
											<span className="text-[13px] font-semibold text-gray-900">
												₹{itemPriceTotal.toLocaleString("en-IN")}
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					{/* Summary and WhatsApp checkout */}
					<div className="border-t border-gray-100 pt-5 mt-6 flex flex-col gap-4">
						<div className="flex items-center justify-between text-sm">
							<span className="text-gray-500 font-medium">Subtotal</span>
							<span className="text-lg font-bold text-gray-900">
								₹{totalPrice.toLocaleString("en-IN")}
							</span>
						</div>
						<p className="text-[10px] text-gray-450 leading-relaxed -mt-2">
							Tax and shipping charges are calculated during WhatsApp review.
						</p>

						<div className="flex gap-3">
							<button
								onClick={closeOverlay}
								className="flex-1 py-3 border border-gray-200 rounded-full text-[12px] font-semibold text-gray-650 hover:border-gray-450 hover:text-gray-900 transition-colors cursor-pointer"
							>
								Continue Shopping
							</button>
							<button
								onClick={handleCheckout}
								className="flex-1 py-3 text-[12px] font-semibold text-white rounded-full flex items-center justify-center gap-2 hover:bg-opacity-95 shadow-sm shadow-[#25d366]/20 cursor-pointer"
								style={{ backgroundColor: "#25D366" }}
							>
								💬 Checkout on WhatsApp
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
