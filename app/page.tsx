"use client";

import {
	AnnouncementCarousel,
	Navbar,
	CategoryStrip,
	HeroCarousel,
	TopSelling,
	CTABanner1,
	ReelsSection,
	TrendingProducts,
	YouMayLike,
	CTABanner2,
	Footer,
} from "./components";

export default function AakritiLanding() {
	return (
		<div className="w-full min-h-screen bg-white">
			<AnnouncementCarousel />
			<Navbar />
			<CategoryStrip />
			<HeroCarousel />
			<TopSelling />
			<CTABanner1 />
			<ReelsSection />
			<TrendingProducts />
			<YouMayLike />
			<CTABanner2 />
			<Footer />
		</div>
	);
}
