"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "@/hooks/useQueries";
import { ProductCard } from "@/app/components/ProductCard";
import { categories, topSelling, trendingProducts, youMayLike } from "@/app/components/data";
import type { Product } from "@/lib/supabase";

// Merge mock lists to construct a robust fallback catalog
const MOCK_CATALOG: Product[] = [
	...topSelling,
	...trendingProducts,
	...youMayLike,
].reduce((acc: Product[], p) => {
	if (!acc.some((item) => item.id === p.id)) acc.push(p);
	return acc;
}, []);

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

function ShopContent() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const categoryParam = searchParams.get("category");
	const tagParam = searchParams.get("tag");

	const { data: liveProducts } = useProducts();
	const catalog =
		liveProducts && liveProducts.length > 0 ? liveProducts : MOCK_CATALOG;

	const [search, setSearch] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("All");
	const [selectedTag, setSelectedTag] = useState<string>("All");

	// Sync filters with query params on load/change
	useEffect(() => {
		if (categoryParam) {
			setSelectedCategory(categoryParam);
			setSelectedTag("All");
		} else if (tagParam) {
			setSelectedTag(tagParam);
			setSelectedCategory("All");
		} else {
			setSelectedCategory("All");
			setSelectedTag("All");
		}
	}, [categoryParam, tagParam]);

	// Filter designs based on search, category selection, and tags
	const filtered = catalog.filter((p) => {
		const matchSearch =
			p.name.toLowerCase().includes(search.toLowerCase()) ||
			(p.description &&
				p.description.toLowerCase().includes(search.toLowerCase()));

		const matchCategory = isCategoryMatch(p.category, selectedCategory);

		let matchTag = true;
		if (selectedTag !== "All") {
			if (selectedTag === "Bestseller") {
				matchTag = p.tag === "Bestseller" || p.tag === "Top Rated";
			} else {
				matchTag = p.tag === selectedTag;
			}
		}

		return matchSearch && matchCategory && matchTag;
	});

	function handleCategoryClick(catLabel: string) {
		const params = new URLSearchParams(window.location.search);
		if (catLabel === "All") {
			params.delete("category");
		} else {
			params.set("category", catLabel);
			params.delete("tag");
		}
		router.push(`/shop?${params.toString()}`);
	}

	function handleTagClick(tagLabel: string) {
		const params = new URLSearchParams(window.location.search);
		if (tagLabel === "All") {
			params.delete("tag");
		} else {
			params.set("tag", tagLabel);
			params.delete("category");
		}
		router.push(`/shop?${params.toString()}`);
	}

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col font-sans">
			{/* Navbar Header */}
			<header className="bg-white border-b border-gray-100 px-6 lg:px-16 h-16 flex items-center justify-between sticky top-0 z-30 shadow-sm/5 bg-white/85 backdrop-blur-md">
				<Link href="/" className="flex items-center gap-2">
					<span className="text-[14px] tracking-[0.25em] uppercase font-bold text-gray-900 font-sans">
						Aakriti
					</span>
					<span className="w-px h-3 bg-gray-300" />
					<span className="text-[12px] tracking-wide text-gray-400 font-medium">
						Store Catalog
					</span>
				</Link>
				<div className="flex items-center gap-6">
					<Link
						href="/custom"
						className="text-[12px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
					>
						Custom Order
					</Link>
					<Link
						href="/"
						className="text-[12px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
					>
						Back to Home
					</Link>
				</div>
			</header>

			<main className="max-w-7xl mx-auto w-full px-6 lg:px-16 py-10 flex-1">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Left Sticky Sidebar */}
					<aside className="col-span-1 md:sticky md:top-24 md:h-[calc(100vh-8rem)] md:border-r md:border-gray-200 md:pr-6 flex flex-col gap-6 overflow-y-auto scrollbar-none">
						{/* Search field */}
						<div className="flex flex-col gap-2">
							<label className="text-[9px] uppercase tracking-wider font-bold text-gray-400">
								Search
							</label>
							<input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Type to search..."
								className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[12px] outline-none focus:border-gray-900 bg-white transition-all shadow-sm/5"
							/>
						</div>

						{/* Category vertical list */}
						<div className="flex flex-col gap-2">
							<label className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-1">
								Categories
							</label>
							<div className="flex flex-col gap-1">
								<button
									onClick={() => handleCategoryClick("All")}
									className={`w-full text-left px-3 py-2 rounded-xl text-[12px] font-medium transition-all ${
										selectedCategory === "All"
											? "bg-gray-900 text-white font-semibold"
											: "text-gray-650 hover:bg-gray-200/50 hover:text-gray-950"
									}`}
								>
									All Categories
								</button>
								{categories
									.filter((c) => c.label !== "Custom Order")
									.map((c) => {
										const isSelected = selectedCategory === c.label;
										return (
											<button
												key={c.id}
												onClick={() => handleCategoryClick(c.label)}
												className={`w-full text-left px-3 py-2 rounded-xl text-[12px] font-medium transition-all flex items-center justify-between ${
													isSelected
														? "bg-gray-900 text-white font-semibold"
														: "text-gray-650 hover:bg-gray-200/50 hover:text-gray-950"
												}`}
											>
												<div className="flex items-center gap-1.5">
													<span className="opacity-80">{c.icon}</span>
													<span>{c.label}</span>
												</div>
												<span
													className={`text-[9px] scale-95 font-semibold ${
														isSelected ? "text-white/60" : "text-gray-400"
													}`}
												>
													{c.count}
												</span>
											</button>
										);
									})}
							</div>
						</div>

						{/* Tag selection list */}
						<div className="flex flex-col gap-2">
							<label className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-1">
								Featured Collections
							</label>
							<div className="flex flex-col gap-1">
								{["All", "Bestseller", "New", "Trending", "Limited", "Top Rated"].map((tag) => {
									const isSelected = selectedTag === tag;
									return (
										<button
											key={tag}
											onClick={() => handleTagClick(tag)}
											className={`w-full text-left px-3 py-2 rounded-xl text-[12px] font-medium transition-all ${
												isSelected
													? "bg-gray-900 text-white font-semibold"
													: "text-gray-650 hover:bg-gray-200/50 hover:text-gray-950"
											}`}
										>
											{tag === "All" ? "All Special Items" : tag}
										</button>
									);
								})}
							</div>
						</div>
					</aside>

					{/* Right Content Panel */}
					<div className="md:col-span-3 flex flex-col gap-6">
						<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-gray-100">
							<div>
								<h1
									className="text-3xl font-medium text-gray-900 leading-tight"
									style={{ fontFamily: "Georgia, serif" }}
								>
									{selectedCategory !== "All"
										? `${selectedCategory} Collection`
										: selectedTag !== "All"
											? `${selectedTag} Items`
											: "Our Catalog"}
								</h1>
								<p className="text-[12px] text-gray-400 mt-1">
									Displaying {filtered.length} products
								</p>
							</div>
						</div>

						{/* Products Grid */}
						{filtered.length === 0 ? (
							<div className="text-[13px] text-gray-500 font-medium pt-2">
								No products found matching your filter options.
							</div>
						) : (
							<motion.div
								layout
								className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6"
							>
								<AnimatePresence>
									{filtered.map((product) => (
										<motion.div
											layout
											key={product.id}
											initial={{ opacity: 0, scale: 0.96 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.96 }}
											transition={{ duration: 0.3 }}
										>
											<ProductCard p={product} />
										</motion.div>
									))}
								</AnimatePresence>
							</motion.div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}

export default function ShopPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-gray-50 flex items-center justify-center text-[13px] text-gray-400">
					Loading Store Catalog...
				</div>
			}
		>
			<ShopContent />
		</Suspense>
	);
}
