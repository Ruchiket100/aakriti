"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Product, Reel, Offer, CustomOrder } from "@/lib/supabase";

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

const EMPTY_PRODUCT: Partial<Product> = {
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
	show_in_carousel: false,
	carousel_subtitle: "",
	carousel_desc: "",
	carousel_cta: "Shop Now",
};

const EMPTY_OFFER: Partial<Offer> = {
	label: "",
	text: "",
	cta: "Shop Now",
	accent: "#1a1a1a",
};

const EMPTY_REEL: Partial<Reel> = {
	user: "",
	label: "",
	video_url: "",
	thumbnail_url: "",
	likes: "0",
	views: "0",
};

export default function AdminDashboard() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<"products" | "offers" | "reels" | "custom_orders">("products");
	const [loading, setLoading] = useState(true);
	const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

	// Custom Orders State
	const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
	const [deletingCustomOrderId, setDeletingCustomOrderId] = useState<string | null>(null);

	// Products State
	const [products, setProducts] = useState<Product[]>([]);
	const [productForm, setProductForm] = useState<Partial<Product>>(EMPTY_PRODUCT);
	const [editingProductId, setEditingProductId] = useState<string | null>(null);
	const [showProductForm, setShowProductForm] = useState(false);
	const [savingProduct, setSavingProduct] = useState(false);
	const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
	const [uploadingProductImages, setUploadingProductImages] = useState(false);
	const [searchProduct, setSearchProduct] = useState("");
	const [filterCat, setFilterCat] = useState("All");
	const fileProductRef = useRef<HTMLInputElement>(null);

	// Offers State
	const [offers, setOffers] = useState<Offer[]>([]);
	const [offerForm, setOfferForm] = useState<Partial<Offer>>(EMPTY_OFFER);
	const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
	const [showOfferForm, setShowOfferForm] = useState(false);
	const [savingOffer, setSavingOffer] = useState(false);
	const [deletingOfferId, setDeletingOfferId] = useState<string | null>(null);

	// Reels State
	const [reels, setReels] = useState<Reel[]>([]);
	const [reelForm, setReelForm] = useState<Partial<Reel>>(EMPTY_REEL);
	const [editingReelId, setEditingReelId] = useState<string | null>(null);
	const [showReelForm, setShowReelForm] = useState(false);
	const [savingReel, setSavingReel] = useState(false);
	const [deletingReelId, setDeletingReelId] = useState<string | null>(null);
	const [uploadingVideo, setUploadingVideo] = useState(false);
	const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
	const videoFileRef = useRef<HTMLInputElement>(null);
	const thumbnailFileRef = useRef<HTMLInputElement>(null);

	function showToast(msg: string, type: "success" | "error" = "success") {
		setToast({ msg, type });
		setTimeout(() => setToast(null), 3000);
	}

	// Fetch API helper
	async function loadAllData() {
		setLoading(true);
		try {
			// Fetch products
			const resP = await fetch("/api/admin/products");
			if (resP.status === 401) {
				router.push("/admin/login");
				return;
			}
			const dataP = await resP.json();
			setProducts(dataP);

			// Fetch offers
			const resO = await fetch("/api/admin/offers");
			if (resO.ok) {
				const dataO = await resO.json();
				setOffers(dataO);
			}

			// Fetch reels
			const resR = await fetch("/api/admin/reels");
			if (resR.ok) {
				const dataR = await resR.json();
				setReels(dataR);
			}

			// Fetch custom orders
			const resC = await fetch("/api/admin/custom-orders");
			if (resC.ok) {
				const dataC = await resC.json();
				setCustomOrders(dataC);
			}
		} catch {
			showToast("Failed to load dashboard data", "error");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadAllData();
	}, []);

	// Logout
	async function handleLogout() {
		await fetch("/api/admin/logout", { method: "POST" });
		router.push("/admin/login");
	}

	// --- Custom Orders Handlers ---
	async function handleCustomOrderStatusUpdate(id: string, status: string) {
		try {
			const res = await fetch("/api/admin/custom-orders", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, status }),
			});
			if (!res.ok) throw new Error();
			showToast("Order status updated");
			loadAllData();
		} catch {
			showToast("Failed to update status", "error");
		}
	}

	async function handleCustomOrderDelete(id: string) {
		if (!confirm("Delete this custom order request?")) return;
		setDeletingCustomOrderId(id);
		try {
			const res = await fetch("/api/admin/custom-orders", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			if (!res.ok) throw new Error();
			showToast("Order deleted");
			loadAllData();
		} catch {
			showToast("Failed to delete order", "error");
		} finally {
			setDeletingCustomOrderId(null);
		}
	}

	// --- Products CRUD ---
	async function handleProductSave() {
		if (!productForm.name || !productForm.price) return;
		setSavingProduct(true);
		try {
			const method = editingProductId ? "PATCH" : "POST";
			const body = editingProductId ? { ...productForm, id: editingProductId } : productForm;
			const res = await fetch("/api/admin/products", {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (!res.ok) throw new Error();
			showToast(editingProductId ? "Product updated" : "Product created");
			setShowProductForm(false);
			setProductForm(EMPTY_PRODUCT);
			setEditingProductId(null);
			loadAllData();
		} catch {
			showToast("Failed to save product", "error");
		} finally {
			setSavingProduct(false);
		}
	}

	async function handleProductDelete(id: string) {
		if (!confirm("Delete this product?")) return;
		setDeletingProductId(id);
		try {
			const res = await fetch("/api/admin/products", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			if (!res.ok) throw new Error();
			showToast("Product deleted");
			loadAllData();
		} catch {
			showToast("Failed to delete product", "error");
		} finally {
			setDeletingProductId(null);
		}
	}

	async function handleProductImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (!files?.length) return;
		setUploadingProductImages(true);
		const urls: string[] = [];
		try {
			for (const file of Array.from(files)) {
				const fd = new FormData();
				fd.append("file", file);
				const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
				const data = await res.json();
				if (data.url) urls.push(data.url);
			}
			setProductForm((f) => ({ ...f, images: [...(f.images ?? []), ...urls] }));
			showToast(`${urls.length} photo(s) uploaded successfully`);
		} catch {
			showToast("Upload failed", "error");
		} finally {
			setUploadingProductImages(false);
		}
	}

	function removeProductImage(url: string) {
		setProductForm((f) => ({ ...f, images: f.images?.filter((u) => u !== url) }));
	}

	function openProductEdit(p: Product) {
		setProductForm(p);
		setEditingProductId(p.id);
		setShowProductForm(true);
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	// --- Offers CRUD ---
	async function handleOfferSave() {
		if (!offerForm.label || !offerForm.text) return;
		setSavingOffer(true);
		try {
			const method = editingOfferId ? "PATCH" : "POST";
			const body = editingOfferId ? { ...offerForm, id: editingOfferId } : offerForm;
			const res = await fetch("/api/admin/offers", {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (!res.ok) throw new Error();
			showToast(editingOfferId ? "Offer updated" : "Offer created");
			setShowOfferForm(false);
			setOfferForm(EMPTY_OFFER);
			setEditingOfferId(null);
			loadAllData();
		} catch {
			showToast("Failed to save offer", "error");
		} finally {
			setSavingOffer(false);
		}
	}

	async function handleOfferDelete(id: string) {
		if (!confirm("Delete this offer?")) return;
		setDeletingOfferId(id);
		try {
			const res = await fetch("/api/admin/offers", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			if (!res.ok) throw new Error();
			showToast("Offer deleted");
			loadAllData();
		} catch {
			showToast("Failed to delete offer", "error");
		} finally {
			setDeletingOfferId(null);
		}
	}

	function openOfferEdit(o: Offer) {
		setOfferForm(o);
		setEditingOfferId(o.id);
		setShowOfferForm(true);
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	// --- Reels CRUD ---
	async function handleReelSave() {
		if (!reelForm.user || !reelForm.label) return;
		setSavingReel(true);
		try {
			const method = editingReelId ? "PATCH" : "POST";
			const body = editingReelId ? { ...reelForm, id: editingReelId } : reelForm;
			const res = await fetch("/api/admin/reels", {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (!res.ok) throw new Error();
			showToast(editingReelId ? "Reel updated" : "Reel created");
			setShowReelForm(false);
			setReelForm(EMPTY_REEL);
			setEditingReelId(null);
			loadAllData();
		} catch {
			showToast("Failed to save reel", "error");
		} finally {
			setSavingReel(false);
		}
	}

	async function handleReelDelete(id: string) {
		if (!confirm("Delete this reel?")) return;
		setDeletingReelId(id);
		try {
			const res = await fetch("/api/admin/reels", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			if (!res.ok) throw new Error();
			showToast("Reel deleted");
			loadAllData();
		} catch {
			showToast("Failed to delete reel", "error");
		} finally {
			setDeletingReelId(null);
		}
	}

	async function handleReelMediaUpload(e: React.ChangeEvent<HTMLInputElement>, field: "video_url" | "thumbnail_url") {
		const files = e.target.files;
		if (!files?.length) return;
		const isVideo = field === "video_url";
		if (isVideo) setUploadingVideo(true);
		else setUploadingThumbnail(true);

		try {
			const fd = new FormData();
			fd.append("file", files[0]);
			const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
			const data = await res.json();
			if (data.url) {
				setReelForm((f) => ({ ...f, [field]: data.url }));
				showToast("Media uploaded successfully");
			} else {
				throw new Error();
			}
		} catch {
			showToast("Media upload failed", "error");
		} finally {
			if (isVideo) setUploadingVideo(false);
			else setUploadingThumbnail(false);
		}
	}

	function openReelEdit(r: Reel) {
		setReelForm(r);
		setEditingReelId(r.id);
		setShowReelForm(true);
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	// Helpers
	function isCategoryMatch(productCat?: string, filterCat?: string) {
		if (!filterCat || filterCat === "All") return true;
		if (!productCat) return false;

		const pCat = productCat.trim().toLowerCase();
		const fCat = filterCat.trim().toLowerCase();

		if (pCat === fCat) return true;

		// Singular vs Plural: match "lamp" with "lamps", "keychain" with "keychains"
		if (pCat + "s" === fCat || fCat + "s" === pCat) return true;

		// Common matching extensions
		if (fCat === "home decor" && (pCat === "home" || pCat === "decor" || pCat === "home_decor")) return true;
		if (fCat === "car decor" && (pCat === "car" || pCat === "car_decor")) return true;

		return false;
	}

	const filteredProducts = products.filter((p) => {
		const matchSearch = p.name.toLowerCase().includes(searchProduct.toLowerCase());
		const matchCat = isCategoryMatch(p.category, filterCat);
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
						style={{ background: toast.type === "success" ? "#16a34a" : "#dc2626" }}
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
						Admin Panel
					</span>
				</div>
				<div className="flex items-center gap-4">
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
				{/* Tab Selection */}
				<div className="flex border-b border-gray-200 gap-6 mb-8 text-[13px] font-medium">
					<button
						onClick={() => setActiveTab("products")}
						className={`pb-3.5 border-b-2 transition-all ${
							activeTab === "products"
								? "border-gray-900 text-gray-950 font-semibold"
								: "border-transparent text-gray-400 hover:text-gray-600"
						}`}
					>
						Products ({products.length})
					</button>
					<button
						onClick={() => setActiveTab("offers")}
						className={`pb-3.5 border-b-2 transition-all ${
							activeTab === "offers"
								? "border-gray-900 text-gray-950 font-semibold"
								: "border-transparent text-gray-400 hover:text-gray-600"
						}`}
					>
						Announcement Offers ({offers.length})
					</button>
					<button
						onClick={() => setActiveTab("reels")}
						className={`pb-3.5 border-b-2 transition-all ${
							activeTab === "reels"
								? "border-gray-900 text-gray-950 font-semibold"
								: "border-transparent text-gray-400 hover:text-gray-600"
						}`}
					>
						Reels & Videos ({reels.length})
					</button>
					<button
						onClick={() => setActiveTab("custom_orders")}
						className={`pb-3.5 border-b-2 transition-all ${
							activeTab === "custom_orders"
								? "border-gray-900 text-gray-950 font-semibold"
								: "border-transparent text-gray-400 hover:text-gray-600"
						}`}
					>
						Custom Orders ({customOrders.length})
					</button>
				</div>

				{/* Loading indicator */}
				{loading && (
					<div className="text-center py-20 text-[13px] text-gray-400">
						Loading dashboard content...
					</div>
				)}

				{!loading && (
					<>
						{/* ==================== PRODUCTS TAB ==================== */}
						{activeTab === "products" && (
							<div>
								{/* Trigger Button */}
								<div className="flex justify-end mb-6">
									<motion.button
										onClick={() => {
											setProductForm(EMPTY_PRODUCT);
											setEditingProductId(null);
											setShowProductForm(!showProductForm);
										}}
										whileTap={{ scale: 0.97 }}
										className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-900 text-white text-[12px] font-medium"
									>
										{showProductForm ? "Close Form" : "Add Product"}
									</motion.button>
								</div>

								{/* Product Form */}
								<AnimatePresence>
									{showProductForm && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											exit={{ opacity: 0, height: 0 }}
											className="overflow-hidden mb-8"
										>
											<div className="bg-white rounded-2xl border border-gray-100 p-6">
												<h2 className="text-[15px] font-semibold text-gray-900 mb-6">
													{editingProductId ? "Edit Product" : "New Product"}
												</h2>

												<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
													{/* Name */}
													<div className="lg:col-span-2">
														<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
															Product Name *
														</label>
														<input
															value={productForm.name ?? ""}
															onChange={(e) =>
																setProductForm((f) => ({
																	...f,
																	name: e.target.value,
																}))
															}
															className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900"
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
															value={productForm.price ?? ""}
															onChange={(e) =>
																setProductForm((f) => ({
																	...f,
																	price: parseFloat(e.target.value),
																}))
															}
															className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900"
															placeholder="3000"
														/>
													</div>

													{/* Category */}
													<div>
														<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
															Category
														</label>
														<select
															value={productForm.category ?? "Lamps"}
															onChange={(e) =>
																setProductForm((f) => ({
																	...f,
																	category: e.target.value,
																}))
															}
															className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900 bg-white"
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
															value={productForm.tag ?? "New"}
															onChange={(e) =>
																setProductForm((f) => ({
																	...f,
																	tag: e.target.value,
																}))
															}
															className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-gray-900 bg-white"
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
															value={productForm.size ?? ""}
															onChange={(e) =>
																setProductForm((f) => ({
																	...f,
																	size: e.target.value,
																}))
															}
															className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none"
															placeholder="e.g. 22 cm"
														/>
													</div>

													{/* Material */}
													<div>
														<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
															Material
														</label>
														<input
															value={productForm.material ?? ""}
															onChange={(e) =>
																setProductForm((f) => ({
																	...f,
																	material: e.target.value,
																}))
															}
															className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none"
															placeholder="PLA Resin"
														/>
													</div>

													{/* Delivery */}
													<div>
														<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
															Delivery Days
														</label>
														<input
															value={productForm.delivery_days ?? ""}
															onChange={(e) =>
																setProductForm((f) => ({
																	...f,
																	delivery_days: e.target.value,
																}))
															}
															className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none"
															placeholder="5–7 days"
														/>
													</div>

													{/* Rating */}
													<div>
														<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
															Rating
														</label>
														<input
															type="number"
															step="0.1"
															value={productForm.rating ?? 5.0}
															onChange={(e) =>
																setProductForm((f) => ({
																	...f,
																	rating: parseFloat(e.target.value),
																}))
															}
															className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none"
														/>
													</div>

													{/* In Stock */}
													<div className="flex items-center gap-3 pt-6">
														<input
															type="checkbox"
															id="prod_in_stock"
															checked={productForm.in_stock ?? true}
															onChange={(e) =>
																setProductForm((f) => ({
																	...f,
																	in_stock: e.target.checked,
																}))
															}
															className="w-4 h-4 accent-gray-900"
														/>
														<label htmlFor="prod_in_stock" className="text-[13px] text-gray-700 select-none">
															In Stock
														</label>
													</div>

													{/* Show in Carousel Checkbox */}
													<div className="flex items-center gap-3 pt-6">
														<input
															type="checkbox"
															id="prod_show_in_carousel"
															checked={productForm.show_in_carousel ?? false}
															onChange={(e) =>
																setProductForm((f) => ({
																	...f,
																	show_in_carousel: e.target.checked,
																}))
															}
															className="w-4 h-4 accent-gray-900"
														/>
														<label htmlFor="prod_show_in_carousel" className="text-[13px] text-gray-700 select-none">
															Show in Hero Carousel
														</label>
													</div>

													{/* Conditional Carousel Fields */}
													{productForm.show_in_carousel && (
														<>
															<div className="lg:col-span-3 border-t border-gray-100 pt-4 mt-2">
																<h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900">
																	Hero Carousel Custom Settings
																</h3>
															</div>
															<div>
																<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
																	Carousel Subtitle
																</label>
																<input
																	value={productForm.carousel_subtitle ?? ""}
																	onChange={(e) =>
																		setProductForm((f) => ({
																			...f,
																			carousel_subtitle: e.target.value,
																		}))
																	}
																	className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none"
																	placeholder="e.g. Modern 3D Printed Table Lamp"
																/>
															</div>
															<div>
																<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
																	Carousel CTA Button Text
																</label>
																<input
																	value={productForm.carousel_cta ?? "Shop Now"}
																	onChange={(e) =>
																		setProductForm((f) => ({
																			...f,
																			carousel_cta: e.target.value,
																		}))
																	}
																	className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none"
																	placeholder="e.g. Shop Lamps"
																/>
															</div>
															<div className="lg:col-span-3">
																<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
																	Carousel Description
																</label>
																<textarea
																	value={productForm.carousel_desc ?? ""}
																	onChange={(e) =>
																		setProductForm((f) => ({
																			...f,
																			carousel_desc: e.target.value,
																		}))
																	}
																	rows={2}
																	className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none resize-none"
																	placeholder="e.g. Precision-printed in matte white. Ships in 5 days."
																/>
															</div>
														</>
													)}

													{/* Description */}
													<div className="lg:col-span-3">
														<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
															Description
														</label>
														<textarea
															value={productForm.description ?? ""}
															onChange={(e) =>
																setProductForm((f) => ({
																	...f,
																	description: e.target.value,
																}))
															}
															rows={3}
															className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none resize-none"
															placeholder="Product description details..."
														/>
													</div>

													{/* Images */}
													<div className="lg:col-span-3">
														<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
															Images
														</label>
														<div className="flex flex-wrap gap-3">
															{productForm.images?.map((url) => (
																<div key={url} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-150">
																	<img src={url} alt="" className="w-full h-full object-cover" />
																	<button
																		onClick={() => removeProductImage(url)}
																		className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px]"
																	>
																		✕
																	</button>
																</div>
															))}
															<motion.button
																onClick={() => fileProductRef.current?.click()}
																whileTap={{ scale: 0.95 }}
																className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600"
															>
																{uploadingProductImages ? (
																	<div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
																) : (
																	<>
																		<span className="text-[16px]">+</span>
																		<span className="text-[8px] uppercase tracking-wide font-bold">Upload</span>
																	</>
																)}
															</motion.button>
														</div>
														<input
															ref={fileProductRef}
															type="file"
															accept="image/*"
															multiple
															className="hidden"
															onChange={handleProductImageUpload}
														/>
													</div>
												</div>

												{/* Form Actions */}
												<div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
													<motion.button
														onClick={handleProductSave}
														disabled={savingProduct || !productForm.name || !productForm.price}
														whileTap={{ scale: 0.97 }}
														className="px-7 py-2.5 rounded-full bg-gray-900 text-white text-[13px] font-medium disabled:opacity-50"
													>
														{savingProduct ? "Saving..." : editingProductId ? "Update Product" : "Create Product"}
													</motion.button>
													<button
														onClick={() => {
															setShowProductForm(false);
															setProductForm(EMPTY_PRODUCT);
															setEditingProductId(null);
														}}
														className="text-[13px] text-gray-400 hover:text-gray-700"
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
									<input
										value={searchProduct}
										onChange={(e) => setSearchProduct(e.target.value)}
										placeholder="Search products..."
										className="w-full max-w-xs border border-gray-200 rounded-full px-4 py-2 text-[13px] outline-none focus:border-gray-900 bg-white"
									/>
									<div className="flex gap-2 flex-wrap">
										{["All", ...CATEGORIES].map((c) => (
											<button
												key={c}
												onClick={() => setFilterCat(c)}
												className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium border transition-colors ${
													filterCat === c
														? "bg-gray-900 border-gray-900 text-white"
														: "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
												}`}
											>
												{c}
											</button>
										))}
									</div>
								</div>

								{/* Table */}
								{filteredProducts.length === 0 ? (
									<div className="text-center py-20 text-[13px] text-gray-400 bg-white rounded-2xl border border-gray-100">
										No products found
									</div>
								) : (
									<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
										<table className="w-full text-[13px]">
											<thead>
												<tr className="border-b border-gray-100 bg-gray-50/50">
													<th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium">Product</th>
													<th className="text-left px-4 py-3.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium">Category</th>
													<th className="text-left px-4 py-3.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium">Price</th>
													<th className="text-left px-4 py-3.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium">Stock</th>
													<th className="px-4 py-3.5" />
												</tr>
											</thead>
											<tbody>
												{filteredProducts.map((p) => (
													<tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/40">
														<td className="px-5 py-3.5">
															<div className="flex items-center gap-3">
																{p.images?.[0] ? (
																	<img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
																) : (
																	<div className="w-10 h-10 rounded-lg bg-gray-100" />
																)}
																<span className="font-medium text-gray-900">{p.name}</span>
															</div>
														</td>
														<td className="px-4 py-3.5 text-gray-500">{p.category}</td>
														<td className="px-4 py-3.5 font-medium text-gray-900">₹{p.price.toLocaleString("en-IN")}</td>
														<td className="px-4 py-3.5">
															<span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.in_stock ? "bg-green-150 text-green-700" : "bg-red-150 text-red-650"}`}>
																{p.in_stock ? "In stock" : "Out of stock"}
															</span>
														</td>
														<td className="px-4 py-3.5 text-right">
															<div className="flex gap-2 justify-end">
																<button onClick={() => openProductEdit(p)} className="text-[11px] text-gray-400 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100">Edit</button>
																<button onClick={() => handleProductDelete(p.id)} className="text-[11px] text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50">
																	{deletingProductId === p.id ? "Deleting..." : "Delete"}
																</button>
															</div>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
							</div>
						)}

						{/* ==================== OFFERS TAB ==================== */}
						{activeTab === "offers" && (
							<div>
								{/* Trigger button */}
								<div className="flex justify-end mb-6">
									<motion.button
										onClick={() => {
											setOfferForm(EMPTY_OFFER);
											setEditingOfferId(null);
											setShowOfferForm(!showOfferForm);
										}}
										whileTap={{ scale: 0.97 }}
										className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-900 text-white text-[12px] font-medium"
									>
										{showOfferForm ? "Close Form" : "Add Offer"}
									</motion.button>
								</div>

								{/* Offer Form */}
								<AnimatePresence>
									{showOfferForm && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											exit={{ opacity: 0, height: 0 }}
											className="overflow-hidden mb-8"
										>
											<div className="bg-white rounded-2xl border border-gray-100 p-6">
												<h2 className="text-[15px] font-semibold text-gray-900 mb-6">
													{editingOfferId ? "Edit Announcement Offer" : "New Announcement Offer"}
												</h2>

												<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
													{/* Label / Eyebrow */}
													<div>
														<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
															Eyebrow Label (e.g. FREE SHIPPING) *
														</label>
														<input
															value={offerForm.label ?? ""}
															onChange={(e) =>
																setOfferForm((f) => ({ ...f, label: e.target.value }))
															}
															className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none"
															placeholder="e.g. FESTIVE DEALS"
														/>
													</div>

													{/* CTA Button Text */}
													<div>
														<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
															CTA Label *
														</label>
														<input
															value={offerForm.cta ?? ""}
															onChange={(e) =>
																setOfferForm((f) => ({ ...f, cta: e.target.value }))
															}
															className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none"
															placeholder="e.g. Explore Now"
														/>
													</div>

													{/* Offer Announcement Text */}
													<div className="sm:col-span-2">
														<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
															Announcement Text *
														</label>
														<input
															value={offerForm.text ?? ""}
															onChange={(e) =>
																setOfferForm((f) => ({ ...f, text: e.target.value }))
															}
															className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none"
															placeholder="e.g. Get 20% off on all table lamps this week only!"
														/>
													</div>

													{/* Accent Hex Color */}
													<div>
														<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
															Background Accent Color (Hex)
														</label>
														<input
															value={offerForm.accent ?? ""}
															onChange={(e) =>
																setOfferForm((f) => ({ ...f, accent: e.target.value }))
															}
															className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none"
															placeholder="e.g. #1a1a1a"
														/>
													</div>
												</div>

												{/* Form Actions */}
												<div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
													<motion.button
														onClick={handleOfferSave}
														disabled={savingOffer || !offerForm.label || !offerForm.text}
														whileTap={{ scale: 0.97 }}
														className="px-7 py-2.5 rounded-full bg-gray-900 text-white text-[13px] font-medium disabled:opacity-50"
													>
														{savingOffer ? "Saving..." : editingOfferId ? "Update Offer" : "Create Offer"}
													</motion.button>
													<button
														onClick={() => {
															setShowOfferForm(false);
															setOfferForm(EMPTY_OFFER);
															setEditingOfferId(null);
														}}
														className="text-[13px] text-gray-400 hover:text-gray-700"
													>
														Cancel
													</button>
												</div>
											</div>
										</motion.div>
									)}
								</AnimatePresence>

								{/* Table */}
								{offers.length === 0 ? (
									<div className="text-center py-20 text-[13px] text-gray-400 bg-white rounded-2xl border border-gray-100">
										No announcement offers found. Add one to show in the carousel!
									</div>
								) : (
									<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
										<table className="w-full text-[13px]">
											<thead>
												<tr className="border-b border-gray-100 bg-gray-50/50">
													<th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium">Label</th>
													<th className="text-left px-4 py-3.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium">Text</th>
													<th className="text-left px-4 py-3.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium">CTA</th>
													<th className="px-4 py-3.5" />
												</tr>
											</thead>
											<tbody>
												{offers.map((o) => (
													<tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/40">
														<td className="px-5 py-3.5 font-bold text-gray-900">
															<span className="text-[9px] uppercase tracking-wider px-2 py-0.5 border rounded-full border-gray-300" style={{ backgroundColor: o.accent || "#1a1a1a", color: "#fff" }}>
																{o.label}
															</span>
														</td>
														<td className="px-4 py-3.5 text-gray-750 font-medium">{o.text}</td>
														<td className="px-4 py-3.5 text-gray-500 underline">{o.cta}</td>
														<td className="px-4 py-3.5 text-right">
															<div className="flex gap-2 justify-end">
																<button onClick={() => openOfferEdit(o)} className="text-[11px] text-gray-400 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100">Edit</button>
																<button onClick={() => handleOfferDelete(o.id)} className="text-[11px] text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50">
																	{deletingOfferId === o.id ? "Deleting..." : "Delete"}
																</button>
															</div>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
							</div>
						)}

						{/* ==================== REELS TAB ==================== */}
						{activeTab === "reels" && (
							<div>
								{/* Trigger button */}
								<div className="flex justify-end mb-6">
									<motion.button
										onClick={() => {
											setReelForm(EMPTY_REEL);
											setEditingReelId(null);
											setShowReelForm(!showReelForm);
										}}
										whileTap={{ scale: 0.97 }}
										className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-900 text-white text-[12px] font-medium"
									>
										{showReelForm ? "Close Form" : "Add Reel / Video"}
									</motion.button>
								</div>

								{/* Reel Form */}
								<AnimatePresence>
									{showReelForm && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											exit={{ opacity: 0, height: 0 }}
											className="overflow-hidden mb-8"
										>
											<div className="bg-white rounded-2xl border border-gray-100 p-6">
												<h2 className="text-[15px] font-semibold text-gray-900 mb-6">
													{editingReelId ? "Edit Reel / Video" : "New Reel / Video"}
												</h2>

												<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
													{/* Username */}
													<div>
														<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
															Instagram handle (e.g. @priya_decor) *
														</label>
														<input
															value={reelForm.user ?? ""}
															onChange={(e) =>
																setReelForm((f) => ({ ...f, user: e.target.value }))
															}
															className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none"
															placeholder="@username"
														/>
													</div>

													{/* Label */}
													<div>
														<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
															Video Title / Label *
														</label>
														<input
															value={reelForm.label ?? ""}
															onChange={(e) =>
																setReelForm((f) => ({ ...f, label: e.target.value }))
															}
															className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none"
															placeholder="e.g. Unboxing custom ganesh idol!"
														/>
													</div>

													{/* Likes / Views */}
													<div>
														<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
															Likes count text (e.g. 4.2k)
														</label>
														<input
															value={reelForm.likes ?? ""}
															onChange={(e) =>
																setReelForm((f) => ({ ...f, likes: e.target.value }))
															}
															className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none"
															placeholder="e.g. 1.2k"
														/>
													</div>
													<div>
														<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
															Views count text (e.g. 25k)
														</label>
														<input
															value={reelForm.views ?? ""}
															onChange={(e) =>
																setReelForm((f) => ({ ...f, views: e.target.value }))
															}
															className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none"
															placeholder="e.g. 10k"
														/>
													</div>

													{/* Video File Upload */}
													<div>
														<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
															Reel Video File (.mp4, .mov)
														</label>
														<div className="flex gap-2">
															<input
																type="text"
																readOnly
																value={reelForm.video_url ?? ""}
																placeholder="Upload video or paste link..."
																className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-[12px] bg-gray-50 outline-none"
															/>
															<motion.button
																type="button"
																onClick={() => videoFileRef.current?.click()}
																whileTap={{ scale: 0.95 }}
																className="px-4 bg-gray-900 text-white rounded-xl text-[12px] font-medium"
															>
																{uploadingVideo ? "Uploading..." : "Upload Video"}
															</motion.button>
														</div>
														<input
															ref={videoFileRef}
															type="file"
															accept="video/*"
															className="hidden"
															onChange={(e) => handleReelMediaUpload(e, "video_url")}
														/>
													</div>

													{/* Thumbnail Image Upload */}
													<div>
														<label className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5 block">
															Thumbnail Image (.png, .jpg)
														</label>
														<div className="flex gap-2">
															<input
																type="text"
																readOnly
																value={reelForm.thumbnail_url ?? ""}
																placeholder="Upload thumbnail or paste link..."
																className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-[12px] bg-gray-50 outline-none"
															/>
															<motion.button
																type="button"
																onClick={() => thumbnailFileRef.current?.click()}
																whileTap={{ scale: 0.95 }}
																className="px-4 bg-gray-900 text-white rounded-xl text-[12px] font-medium"
															>
																{uploadingThumbnail ? "Uploading..." : "Upload Image"}
															</motion.button>
														</div>
														<input
															ref={thumbnailFileRef}
															type="file"
															accept="image/*"
															className="hidden"
															onChange={(e) => handleReelMediaUpload(e, "thumbnail_url")}
														/>
													</div>
												</div>

												{/* Form Actions */}
												<div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
													<motion.button
														onClick={handleReelSave}
														disabled={savingReel || !reelForm.user || !reelForm.label}
														whileTap={{ scale: 0.97 }}
														className="px-7 py-2.5 rounded-full bg-gray-900 text-white text-[13px] font-medium disabled:opacity-50"
													>
														{savingReel ? "Saving..." : editingReelId ? "Update Reel" : "Create Reel"}
													</motion.button>
													<button
														onClick={() => {
															setShowReelForm(false);
															setReelForm(EMPTY_REEL);
															setEditingReelId(null);
														}}
														className="text-[13px] text-gray-400 hover:text-gray-700"
													>
														Cancel
													</button>
												</div>
											</div>
										</motion.div>
									)}
								</AnimatePresence>

								{/* Table */}
								{reels.length === 0 ? (
									<div className="text-center py-20 text-[13px] text-gray-400 bg-white rounded-2xl border border-gray-100">
										No reels or videos found. Add some to display them on the homepage!
									</div>
								) : (
									<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
										<table className="w-full text-[13px]">
											<thead>
												<tr className="border-b border-gray-100 bg-gray-50/50">
													<th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium">Reel</th>
													<th className="text-left px-4 py-3.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium">User</th>
													<th className="text-left px-4 py-3.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium">Likes / Views</th>
													<th className="px-4 py-3.5" />
												</tr>
											</thead>
											<tbody>
												{reels.map((r) => (
													<tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/40">
														<td className="px-5 py-3.5">
															<div className="flex items-center gap-3">
																{r.thumbnail_url ? (
																	<img src={r.thumbnail_url} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
																) : (
																	<div className="w-10 h-10 rounded-lg bg-gray-100" />
																)}
																<div className="flex flex-col">
																	<span className="font-medium text-gray-900">{r.label}</span>
																	{r.video_url && (
																		<span className="text-[10px] text-green-600 font-medium">Video uploaded ✓</span>
																	)}
																</div>
															</div>
														</td>
														<td className="px-4 py-3.5 text-gray-600 font-medium">{r.user}</td>
														<td className="px-4 py-3.5 text-gray-500 text-[12px]">{r.likes || 0} ♥ / {r.views || 0} views</td>
														<td className="px-4 py-3.5 text-right">
															<div className="flex gap-2 justify-end">
																<button onClick={() => openReelEdit(r)} className="text-[11px] text-gray-400 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100">Edit</button>
																<button onClick={() => handleReelDelete(r.id)} className="text-[11px] text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50">
																	{deletingReelId === r.id ? "Deleting..." : "Delete"}
																</button>
															</div>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
							</div>
						)}

						{/* ==================== CUSTOM ORDERS TAB ==================== */}
						{activeTab === "custom_orders" && (
							<div>
								{/* Custom Orders Table */}
								{customOrders.length === 0 ? (
									<div className="text-center py-20 text-[13px] text-gray-400 bg-white rounded-2xl border border-gray-100">
										No custom print requests found. They will show up here when submitted by clients!
									</div>
								) : (
									<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
										<table className="w-full text-[13px]">
											<thead>
												<tr className="border-b border-gray-100 bg-gray-50/50">
													<th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium">Project / Client</th>
													<th className="text-left px-4 py-3.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium">Specs</th>
													<th className="text-left px-4 py-3.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium">Description</th>
													<th className="text-left px-4 py-3.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium">Design File</th>
													<th className="text-left px-4 py-3.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium">Status</th>
													<th className="px-4 py-3.5" />
												</tr>
											</thead>
											<tbody>
												{customOrders.map((o) => (
													<tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/40">
														<td className="px-5 py-3.5">
															<div className="flex flex-col">
																<span className="font-semibold text-gray-900">{o.project_name}</span>
																<span className="text-[11px] text-gray-400 mt-0.5">{o.category}</span>
																<span className="text-[11px] text-gray-600 mt-1 font-medium font-sans">
																	👤 {o.name} • {o.phone} • {o.email}
																</span>
															</div>
														</td>
														<td className="px-4 py-3.5 text-gray-600 leading-snug">
															<div>Size: {o.dimensions || "N/A"}</div>
															<div>Mat: {o.material || "PLA"}</div>
															<div>Color: {o.color || "Default"}</div>
															<div>Qty: {o.quantity || 1}</div>
														</td>
														<td className="px-4 py-3.5 text-gray-500 max-w-[200px] truncate" title={o.description}>
															{o.description || "No description provided"}
														</td>
														<td className="px-4 py-3.5">
															{o.file_url ? (
																<a
																	href={o.file_url}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="text-blue-500 hover:text-blue-700 underline font-medium break-all text-[12px]"
																>
																	View/Download 📎
																</a>
															) : (
																<span className="text-gray-400">No file uploaded</span>
															)}
														</td>
														<td className="px-4 py-3.5">
															<select
																value={o.status}
																onChange={(e) => handleCustomOrderStatusUpdate(o.id, e.target.value)}
																className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-[12px] bg-white outline-none focus:border-gray-900 font-medium"
															>
																<option value="pending">Pending</option>
																<option value="quoted">Quoted</option>
																<option value="printing">Printing</option>
																<option value="shipped">Shipped</option>
																<option value="completed">Completed</option>
																<option value="cancelled">Cancelled</option>
															</select>
														</td>
														<td className="px-4 py-3.5 text-right">
															<button
																onClick={() => handleCustomOrderDelete(o.id)}
																className="text-[11px] text-red-400 hover:text-red-600 px-2.5 py-1.5 rounded hover:bg-red-50"
															>
																{deletingCustomOrderId === o.id ? "Deleting..." : "Delete"}
															</button>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
							</div>
						)}
					</>
				)}
			</main>
		</div>
	);
}
