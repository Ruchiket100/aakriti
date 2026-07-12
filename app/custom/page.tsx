"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const CATEGORIES = [
	"Lamps",
	"Home Decor",
	"Car Decor",
	"Keychains",
	"Devotional",
	"Miniature",
	"Mechanical Parts",
	"Scale Model",
	"Other",
];

const MATERIALS = [
	{ name: "PLA (Standard Biodegradable)", desc: "Excellent details, eco-friendly, best for indoor decor." },
	{ name: "Resin (Ultra High Resolution)", desc: "obsessively detailed, smooth finish, best for miniatures/figures." },
	{ name: "PETG (Durable / Heat Resistant)", desc: "Tough, impact resistant, weather proof, best for functional parts." },
	{ name: "ABS (High Strength / Industrial)", desc: "Very durable, industrial grade, can be sanded and painted." },
];

export default function CustomOrderPage() {
	const [form, setForm] = useState({
		name: "",
		email: "",
		phone: "",
		project_name: "",
		category: "Lamps",
		description: "",
		dimensions: "",
		material: "PLA (Standard Biodegradable)",
		color: "Matte White",
		quantity: 1,
		file_url: "",
	});

	const [uploading, setUploading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [submittedOrder, setSubmittedOrder] = useState<any | null>(null);
	const [error, setError] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (!files?.length) return;
		setUploading(true);
		setError("");

		try {
			const fd = new FormData();
			fd.append("file", files[0]);

			// Call public upload route
			const res = await fetch("/api/upload", {
				method: "POST",
				body: fd,
			});
			const data = await res.json();
			if (data.url) {
				setForm((f) => ({ ...f, file_url: data.url }));
			} else {
				throw new Error(data.error || "Upload failed");
			}
		} catch (err: any) {
			setError("Failed to upload reference file: " + err.message);
		} finally {
			setUploading(false);
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!form.name || !form.email || !form.phone || !form.project_name) {
			setError("Please fill in all required fields.");
			return;
		}

		setSubmitting(true);
		setError("");

		try {
			const res = await fetch("/api/custom-orders", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});
			if (!res.ok) {
				const errData = await res.json();
				throw new Error(errData.error || "Failed to submit request.");
			}
			const order = await res.json();
			setSubmittedOrder(order);
		} catch (err: any) {
			setError(err.message || "Something went wrong.");
		} finally {
			setSubmitting(false);
		}
	}

	function triggerWhatsApp() {
		if (!submittedOrder) return;
		const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
		const lines = [
			`Hi! 👋 I just submitted a *Custom Print Request* on *Aakriti 3D Studio*`,
			``,
			`🆔 *Request ID:* ${submittedOrder.id}`,
			`🛠️ *Project:* ${submittedOrder.project_name}`,
			`📂 *Category:* ${submittedOrder.category}`,
			`📐 *Dimensions:* ${submittedOrder.dimensions || "N/A"}`,
			`🎨 *Color:* ${submittedOrder.color}`,
			`🧱 *Material:* ${submittedOrder.material}`,
			`🔢 *Quantity:* ${submittedOrder.quantity}`,
			submittedOrder.file_url ? `📎 *Reference File:* ${submittedOrder.file_url}` : "",
			``,
			`Please check and share the printing estimate. Thank you!`,
		].filter(Boolean);
		const message = encodeURIComponent(lines.join("\n"));
		window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
	}

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col font-sans">
			{/* Navbar Header */}
			<header className="bg-white border-b border-gray-100 px-6 lg:px-16 h-16 flex items-center justify-between">
				<Link href="/" className="flex items-center gap-2">
					<span className="text-[14px] tracking-[0.25em] uppercase font-bold text-gray-900">
						Aakriti
					</span>
					<span className="w-px h-3 bg-gray-300" />
					<span className="text-[12px] tracking-wide text-gray-400 font-medium">
						3D Studio
					</span>
				</Link>
				<Link href="/" className="text-[12px] text-gray-500 hover:text-gray-900 transition-colors font-medium">
					Back to Home
				</Link>
			</header>

			<main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
				<AnimatePresence mode="wait">
					{!submittedOrder ? (
						<motion.div
							key="form-step"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.4 }}
							className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm"
						>
							<div className="mb-8">
								<h1
									className="text-3xl font-medium text-gray-950"
									style={{ fontFamily: "Georgia, serif" }}
								>
									Start a Custom Print
								</h1>
								<p className="text-[13px] text-gray-400 mt-2">
									Have a specific design, custom prototype, or 3D model? Fill in the details below, and we will analyze your file and share a quotation.
								</p>
							</div>

							{error && (
								<div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-[13px] font-medium mb-6">
									{error}
								</div>
							)}

							<form onSubmit={handleSubmit} className="flex flex-col gap-6">
								{/* Step 1: Contact details */}
								<div className="border-b border-gray-100 pb-5">
									<h2 className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-4">
										1. Contact Details
									</h2>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div>
											<label className="text-[10px] uppercase font-semibold text-gray-400 block mb-1.5">
												Full Name *
											</label>
											<input
												type="text"
												required
												value={form.name}
												onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
												className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900"
												placeholder="John Doe"
											/>
										</div>
										<div>
											<label className="text-[10px] uppercase font-semibold text-gray-400 block mb-1.5">
												Email *
											</label>
											<input
												type="email"
												required
												value={form.email}
												onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
												className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900"
												placeholder="john@example.com"
											/>
										</div>
										<div>
											<label className="text-[10px] uppercase font-semibold text-gray-400 block mb-1.5">
												Phone Number *
											</label>
											<input
												type="tel"
												required
												value={form.phone}
												onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
												className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900"
												placeholder="e.g. +91 9876543210"
											/>
										</div>
									</div>
								</div>

								{/* Step 2: Project Specifications */}
								<div className="border-b border-gray-100 pb-5">
									<h2 className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-4">
										2. Print Specifications
									</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="md:col-span-2">
											<label className="text-[10px] uppercase font-semibold text-gray-400 block mb-1.5">
												Project Name *
											</label>
											<input
												type="text"
												required
												value={form.project_name}
												onChange={(e) => setForm((f) => ({ ...f, project_name: e.target.value }))}
												className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900"
												placeholder="e.g. Custom Portrait Lamp / Replacement Gear"
											/>
										</div>
										<div>
											<label className="text-[10px] uppercase font-semibold text-gray-400 block mb-1.5">
												Category
											</label>
											<select
												value={form.category}
												onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
												className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] bg-white outline-none focus:border-gray-900"
											>
												{CATEGORIES.map((c) => (
													<option key={c}>{c}</option>
												))}
											</select>
										</div>
										<div>
											<label className="text-[10px] uppercase font-semibold text-gray-400 block mb-1.5">
												Approximate Dimensions
											</label>
											<input
												type="text"
												value={form.dimensions}
												onChange={(e) => setForm((f) => ({ ...f, dimensions: e.target.value }))}
												className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900"
												placeholder="e.g. 15cm x 15cm x 20cm"
											/>
										</div>
										<div>
											<label className="text-[10px] uppercase font-semibold text-gray-400 block mb-1.5">
												Color
											</label>
											<input
												type="text"
												value={form.color}
												onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
												className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900"
												placeholder="e.g. Matte White / Black / Silk Gold"
											/>
										</div>
										<div>
											<label className="text-[10px] uppercase font-semibold text-gray-400 block mb-1.5">
												Quantity
											</label>
											<input
												type="number"
												min={1}
												value={form.quantity}
												onChange={(e) => setForm((f) => ({ ...f, quantity: parseInt(e.target.value) || 1 }))}
												className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900"
											/>
										</div>
									</div>

									<div className="mt-4">
										<label className="text-[10px] uppercase font-semibold text-gray-400 block mb-2">
											Select Material
										</label>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
											{MATERIALS.map((m) => (
												<div
													key={m.name}
													onClick={() => setForm((f) => ({ ...f, material: m.name }))}
													className={`border p-3.5 rounded-xl cursor-pointer text-left transition-all ${
														form.material === m.name
															? "border-gray-900 bg-gray-900/5"
															: "border-gray-200 hover:border-gray-400"
													}`}
												>
													<p className="text-[12px] font-semibold text-gray-900">{m.name}</p>
													<p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{m.desc}</p>
												</div>
											))}
										</div>
									</div>
								</div>

								{/* Step 3: Files & Description */}
								<div>
									<h2 className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-4">
										3. Design Files & Description
									</h2>
									<div className="flex flex-col gap-4">
										<div>
											<label className="text-[10px] uppercase font-semibold text-gray-400 block mb-1.5">
												Description / Notes
											</label>
											<textarea
												value={form.description}
												onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
												rows={4}
												className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900 resize-none"
												placeholder="Describe the application of the model, infill requirements, or other specific details..."
											/>
										</div>

										<div>
											<label className="text-[10px] uppercase font-semibold text-gray-400 block mb-1.5">
												Upload 3D Design File / reference photos (.stl, .obj, .png, .jpg)
											</label>
											<div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-gray-400 transition-colors">
												{uploading ? (
													<div className="flex flex-col items-center gap-2">
														<div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
														<span className="text-[11px] text-gray-500 font-medium">Uploading design to storage...</span>
													</div>
												) : form.file_url ? (
													<div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-150">
														<span className="text-[11px] text-green-600 font-bold">✓</span>
														<span className="text-[11px] font-medium text-gray-700 truncate max-w-[200px]">
															{form.file_url.split("/").pop()}
														</span>
														<button
															type="button"
															onClick={() => setForm((f) => ({ ...f, file_url: "" }))}
															className="text-[11px] text-red-500 font-medium ml-2"
														>
															Remove
														</button>
													</div>
												) : (
													<>
														<button
															type="button"
															onClick={() => fileInputRef.current?.click()}
															className="px-4 py-2 border border-gray-200 rounded-full text-[12px] font-semibold text-gray-700 bg-white hover:border-gray-400 transition-colors"
														>
															Choose File
														</button>
														<span className="text-[10px] text-gray-400">STL, OBJ, STP, PDF, JPG, or PNG up to 50MB</span>
													</>
												)}
												<input
													ref={fileInputRef}
													type="file"
													accept=".stl,.obj,.stp,.step,.png,.jpg,.jpeg,.pdf"
													className="hidden"
													onChange={handleFileUpload}
												/>
											</div>
										</div>
									</div>
								</div>

								{/* Submit Button */}
								<motion.button
									type="submit"
									disabled={submitting || uploading}
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.98 }}
									className="w-full bg-gray-900 text-white rounded-full py-3.5 text-[13px] font-semibold mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
								>
									{submitting ? "Submitting Request..." : "Submit Printing Request"}
								</motion.button>
							</form>
						</motion.div>
					) : (
						<motion.div
							key="success-step"
							initial={{ opacity: 0, scale: 0.96 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
							className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center"
						>
							<div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									fill="none"
									stroke="#16a34a"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									viewBox="0 0 24 24"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							</div>

							<h1
								className="text-3xl font-medium text-gray-950"
								style={{ fontFamily: "Georgia, serif" }}
							>
								Request Submitted!
							</h1>
							<p className="text-[13px] text-gray-500 mt-3 max-w-md mx-auto leading-relaxed">
								Thank you, <strong className="text-gray-900">{submittedOrder.name}</strong>! Your print request has been saved with the ID below.
							</p>

							<div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 my-6 font-mono text-[12px] text-gray-600 max-w-xs mx-auto">
								ID: {submittedOrder.id}
							</div>

							<div className="flex flex-col gap-3 max-w-xs mx-auto">
								<motion.button
									onClick={triggerWhatsApp}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.97 }}
									className="w-full bg-[#25D366] text-white rounded-full py-3.5 text-[13px] font-semibold flex items-center justify-center gap-2 shadow-sm shadow-[#25D366]/20"
								>
									💬 Message on WhatsApp
								</motion.button>
								<Link
									href="/"
									className="w-full border border-gray-200 text-gray-600 rounded-full py-3.5 text-[12px] font-semibold hover:border-gray-400 transition-colors block text-center"
								>
									Back to Storefront
								</Link>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</main>
		</div>
	);
}
