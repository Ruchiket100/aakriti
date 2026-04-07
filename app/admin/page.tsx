"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/supabase";

const CATEGORIES = [
	"Lamps",
	"Home Decor",
	"Car Decor",
	"Keychains",
	"Devotional",
	"Miniature",
	"Custom Order",
];
const TAGS = [
	"Bestseller",
	"New",
	"Trending",
	"Popular",
	"Limited",
	"Top Rated",
	"Seasonal",
];

const EMPTY: Partial<Product> = {
	name: "",
	category: "Lamps",
	price: 0,
	tag: "New",
	rating: 5.0,
	reviews: 0,
	description: "",
	size: "",
	material: "PLA Resin",
	delivery_days: "5–7 days",
	images: [],
	in_stock: true,
};

export default function AdminDashboard() {
	const router = useRouter();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [form, setForm] = useState<Partial<Product>>(EMPTY);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const [search, setSearch] = useState("");
	const [filterCat, setFilterCat] = useState("All");
	const [toast, setToast] = useState<{
		msg: string;
		type: "success" | "error";
	} | null>(null);
	const fileRef = useRef<HTMLInputElement>(null);

	function showToast(msg: string, type: "success" | "error" = "success") {
		setToast({ msg, type });
		setTimeout(() => setToast(null), 3000);
	}

	async function fetchProducts() {
		setLoading(true);
		const res = await fetch("/api/admin/products");
		if (res.status === 401) {
			router.push("/admin/login");
			return;
		}
		const data = await res.json();
		setProducts(data);
		setLoading(false);
	}

	useEffect(() => {
		fetchProducts();
	}, []);

	async function handleSave() {
		if (!form.name || !form.price) return;
		setSaving(true);
		try {
			const method = editingId ? "PATCH" : "POST";
			const body = editingId ? { ...form, id: editingId } : form;
			const res = await fetch("/api/admin/products", {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (!res.ok) throw new Error("Failed");
			showToast(editingId ? "Product updated" : "Product created");
			setShowForm(false);
			setForm(EMPTY);
			setEditingId(null);
			fetchProducts();
		} catch {
			showToast("Something went wrong", "error");
		} finally {
			setSaving(false);
		}
	}

	async function handleDelete(id: string) {
		if (!confirm("Delete this product?")) return;
		setDeleting(id);
		const res = await fetch("/api/admin/products", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		});
		if (res.ok) {
			showToast("Product deleted");
			fetchProducts();
		} else showToast("Delete failed", "error");
		setDeleting(null);
	}

	async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (!files?.length) return;
		setUploading(true);
		const urls: string[] = [];
		for (const file of Array.from(files)) {
			const fd = new FormData();
			fd.append("file", file);
			const res = await fetch("/api/admin/upload", {
				method: "POST",
				body: fd,
			});
			const data = await res.json();
			if (data.url) urls.push(data.url);
		}
		setForm((f) => ({ ...f, images: [...(f.images ?? []), ...urls] }));
		setUploading(false);
		showToast(`${urls.length} image(s) uploaded`);
	}

	function removeImage(url: string) {
		setForm((f) => ({ ...f, images: f.images?.filter((u) => u !== url) }));
	}

	function openEdit(p: Product) {
		setForm(p);
		setEditingId(p.id);
		setShowForm(true);
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	async function handleLogout() {
		await fetch("/api/admin/logout", { method: "POST" });
		router.push("/admin/login");
	}

	const filtered = products.filter((p) => {
		const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
		const matchCat = filterCat === "All" || p.category === filterCat;
		return matchSearch && matchCat;
	});

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Toast */}
			<AnimatePresence>
				{toast && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white shadow-lg"
						style={{
							background:
								toast.type === "success"
									? "#16a34a"
									: "#dc2626",
						}}
					>
						{toast.msg}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Header */}
			<header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 lg:px-10 h-14 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="text-[12px] tracking-[0.22em] uppercase font-medium text-gray-900">
						Aakriti
					</span>
					<span className="w-px h-3 bg-gray-300" />
					<span className="text-[12px] tracking-wide text-gray-400">
						Admin Dashboard
					</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="text-[11px] text-gray-400 hidden sm:inline">
						{products.length} products
					</span>
					<motion.button
						onClick={() => {
							setForm(EMPTY);
							setEditingId(null);
							setShowForm(!showForm);
						}}
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
						className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-900 text-white text-[12px] font-medium"
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
							<line x1="12" y1="5" x2="12" y2="19" />
							<line x1="5" y1="12" x2="19" y2="12" />
						</svg>
						Add product
					</motion.button>
					<motion.button
						onClick={handleLogout}
						whileHover={{ scale: 1.05 }}
						className="text-[12px] text-gray-400 hover:text-gray-700 transition-colors"
					>
						Logout
					</motion.button>
				</div>
			</header>

			<main className="max-w-6xl mx-auto px-6 lg:px-10 py-8">
				{/* Product Form */}
				<AnimatePresence>
					{showForm && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{
								duration: 0.35,
								ease: [0.22, 1, 0.36, 1],
							}}
							className="overflow-hidden mb-8"
						>
							<div className="bg-white rounded-2xl border border-gray-100 p-6">
								<div className="flex items-center justify-between mb-6">
									<h2
										className="text-[16px] font-medium text-gray-900"
										style={{ fontFamily: "Georgia, serif" }}
									>
										{editingId
											? "Edit product"
											: "New product"}
									</h2>
									<button
										onClick={() => {
											setShowForm(false);
											setForm(EMPTY);
											setEditingId(null);
										}}
										className="text-gray-400 hover:text-gray-700 transition-colors"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											viewBox="0 0 24 24"
										>
											<line
												x1="18"
												y1="6"
												x2="6"
												y2="18"
											/>
											<line
												x1="6"
												y1="6"
												x2="18"
												y2="18"
											/>
										</svg>
									</button>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{/* Name */}
									<div className="lg:col-span-2">
										<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
											Product Name *
										</label>
										<input
											value={form.name ?? ""}
											onChange={(e) =>
												setForm((f) => ({
													...f,
													name: e.target.value,
												}))
											}
											className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900 transition-colors"
											placeholder="e.g. Orēa Curlé Lamp"
										/>
									</div>

									{/* Price */}
									<div>
										<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
											Price (₹) *
										</label>
										<input
											type="number"
											value={form.price ?? ""}
											onChange={(e) =>
												setForm((f) => ({
													...f,
													price: parseFloat(
														e.target.value,
													),
												}))
											}
											className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900 transition-colors"
											placeholder="3000"
										/>
									</div>

									{/* Category */}
									<div>
										<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
											Category
										</label>
										<select
											value={form.category ?? "Lamps"}
											onChange={(e) =>
												setForm((f) => ({
													...f,
													category: e.target.value,
												}))
											}
											className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900 transition-colors bg-white"
										>
											{CATEGORIES.map((c) => (
												<option key={c}>{c}</option>
											))}
										</select>
									</div>

									{/* Tag */}
									<div>
										<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
											Tag
										</label>
										<select
											value={form.tag ?? "New"}
											onChange={(e) =>
												setForm((f) => ({
													...f,
													tag: e.target.value,
												}))
											}
											className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900 transition-colors bg-white"
										>
											{TAGS.map((t) => (
												<option key={t}>{t}</option>
											))}
										</select>
									</div>

									{/* Size */}
									<div>
										<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
											Size
										</label>
										<input
											value={form.size ?? ""}
											onChange={(e) =>
												setForm((f) => ({
													...f,
													size: e.target.value,
												}))
											}
											className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900 transition-colors"
											placeholder="e.g. 22 cm"
										/>
									</div>

									{/* Material */}
									<div>
										<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
											Material
										</label>
										<input
											value={form.material ?? ""}
											onChange={(e) =>
												setForm((f) => ({
													...f,
													material: e.target.value,
												}))
											}
											className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900 transition-colors"
											placeholder="PLA Resin"
										/>
									</div>

									{/* Delivery */}
									<div>
										<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
											Delivery Days
										</label>
										<input
											value={form.delivery_days ?? ""}
											onChange={(e) =>
												setForm((f) => ({
													...f,
													delivery_days:
														e.target.value,
												}))
											}
											className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900 transition-colors"
											placeholder="5–7 days"
										/>
									</div>

									{/* Rating */}
									<div>
										<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
											Rating (0–5)
										</label>
										<input
											type="number"
											step="0.1"
											min="0"
											max="5"
											value={form.rating ?? 5}
											onChange={(e) =>
												setForm((f) => ({
													...f,
													rating: parseFloat(
														e.target.value,
													),
												}))
											}
											className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900 transition-colors"
										/>
									</div>

									{/* Reviews */}
									<div>
										<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
											Reviews count
										</label>
										<input
											type="number"
											value={form.reviews ?? 0}
											onChange={(e) =>
												setForm((f) => ({
													...f,
													reviews: parseInt(
														e.target.value,
													),
												}))
											}
											className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900 transition-colors"
										/>
									</div>

									{/* In Stock */}
									<div className="flex items-center gap-3 pt-6">
										<input
											type="checkbox"
											id="in_stock"
											checked={form.in_stock ?? true}
											onChange={(e) =>
												setForm((f) => ({
													...f,
													in_stock: e.target.checked,
												}))
											}
											className="w-4 h-4 accent-gray-900"
										/>
										<label
											htmlFor="in_stock"
											className="text-[13px] text-gray-700"
										>
											In Stock
										</label>
									</div>

									{/* Description */}
									<div className="lg:col-span-3">
										<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
											Description
										</label>
										<textarea
											value={form.description ?? ""}
											onChange={(e) =>
												setForm((f) => ({
													...f,
													description: e.target.value,
												}))
											}
											rows={3}
											className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900 transition-colors resize-none"
											placeholder="Product description..."
										/>
									</div>

									{/* Image upload */}
									<div className="lg:col-span-3">
										<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
											Images
										</label>
										<div className="flex flex-wrap gap-3 mb-3">
											{form.images?.map((url) => (
												<div
													key={url}
													className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-100"
												>
													<img
														src={url}
														alt=""
														className="w-full h-full object-cover"
													/>
													<button
														onClick={() =>
															removeImage(url)
														}
														className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px]"
													>
														✕
													</button>
												</div>
											))}
											<motion.button
												whileHover={{ scale: 1.03 }}
												whileTap={{ scale: 0.97 }}
												onClick={() =>
													fileRef.current?.click()
												}
												className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
											>
												{uploading ? (
													<div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
												) : (
													<>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="16"
															height="16"
															fill="none"
															stroke="currentColor"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
															viewBox="0 0 24 24"
														>
															<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
															<polyline points="17 8 12 3 7 8" />
															<line
																x1="12"
																y1="3"
																x2="12"
																y2="15"
															/>
														</svg>
														<span className="text-[9px]">
															Upload
														</span>
													</>
												)}
											</motion.button>
										</div>
										<input
											ref={fileRef}
											type="file"
											accept="image/*"
											multiple
											className="hidden"
											onChange={handleImageUpload}
										/>
									</div>
								</div>

								{/* Save */}
								<div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
									<motion.button
										onClick={handleSave}
										disabled={
											saving || !form.name || !form.price
										}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.97 }}
										className="px-7 py-2.5 rounded-full bg-gray-900 text-white text-[13px] font-medium disabled:opacity-50"
									>
										{saving
											? "Saving..."
											: editingId
												? "Update product"
												: "Create product"}
									</motion.button>
									<button
										onClick={() => {
											setShowForm(false);
											setForm(EMPTY);
											setEditingId(null);
										}}
										className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors"
									>
										Cancel
									</button>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Filters */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
					<div className="relative flex-1 max-w-xs">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							fill="none"
							stroke="#9ca3af"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							viewBox="0 0 24 24"
							className="absolute left-3 top-1/2 -translate-y-1/2"
						>
							<circle cx="11" cy="11" r="8" />
							<path d="M21 21l-4.35-4.35" />
						</svg>
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search products..."
							className="w-full border border-gray-200 rounded-full pl-8 pr-4 py-2 text-[13px] outline-none focus:border-gray-900 transition-colors"
						/>
					</div>
					<div className="flex items-center gap-2 flex-wrap">
						{["All", ...CATEGORIES].map((c) => (
							<motion.button
								key={c}
								onClick={() => setFilterCat(c)}
								whileTap={{ scale: 0.96 }}
								animate={{
									background:
										filterCat === c ? "#111" : "#f9fafb",
									color: filterCat === c ? "#fff" : "#374151",
								}}
								className="px-3.5 py-1.5 rounded-full text-[11px] font-medium border border-transparent transition-colors"
								style={{
									borderColor:
										filterCat === c ? "#111" : "#e5e7eb",
								}}
							>
								{c}
							</motion.button>
						))}
					</div>
				</div>

				{/* Product table */}
				{loading ? (
					<div className="text-center py-20 text-[13px] text-gray-400">
						Loading products...
					</div>
				) : filtered.length === 0 ? (
					<div className="text-center py-20 text-[13px] text-gray-400">
						No products found
					</div>
				) : (
					<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
						<table className="w-full text-[13px]">
							<thead>
								<tr className="border-b border-gray-100">
									<th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium">
										Product
									</th>
									<th className="text-left px-4 py-3.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium hidden sm:table-cell">
										Category
									</th>
									<th className="text-left px-4 py-3.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium">
										Price
									</th>
									<th className="text-left px-4 py-3.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium hidden lg:table-cell">
										Tag
									</th>
									<th className="text-left px-4 py-3.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium hidden lg:table-cell">
										Stock
									</th>
									<th className="px-4 py-3.5" />
								</tr>
							</thead>
							<tbody>
								{filtered.map((p, i) => (
									<motion.tr
										key={p.id}
										initial={{ opacity: 0, y: 8 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: i * 0.04 }}
										className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
									>
										<td className="px-5 py-3.5">
											<div className="flex items-center gap-3">
												{p.images?.[0] ? (
													<img
														src={p.images[0]}
														alt={p.name}
														className="w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0"
													/>
												) : (
													<div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0" />
												)}
												<span className="font-medium text-gray-900 truncate max-w-[140px]">
													{p.name}
												</span>
											</div>
										</td>
										<td className="px-4 py-3.5 text-gray-500 hidden sm:table-cell">
											{p.category}
										</td>
										<td className="px-4 py-3.5 text-gray-900 font-medium">
											₹{p.price.toLocaleString("en-IN")}
										</td>
										<td className="px-4 py-3.5 hidden lg:table-cell">
											<span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
												{p.tag}
											</span>
										</td>
										<td className="px-4 py-3.5 hidden lg:table-cell">
											<span
												className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
											>
												{p.in_stock
													? "In stock"
													: "Out of stock"}
											</span>
										</td>
										<td className="px-4 py-3.5">
											<div className="flex items-center gap-2 justify-end">
												<motion.button
													onClick={() => openEdit(p)}
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}
													className="text-[11px] text-gray-400 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
												>
													Edit
												</motion.button>
												<motion.button
													onClick={() =>
														handleDelete(p.id)
													}
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}
													className="text-[11px] text-red-400 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
												>
													{deleting === p.id
														? "..."
														: "Delete"}
												</motion.button>
											</div>
										</td>
									</motion.tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</main>
		</div>
	);
}
