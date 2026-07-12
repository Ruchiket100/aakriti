import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Product, Reel, Offer } from "@/lib/supabase";

export function useProducts() {
	return useQuery<Product[]>({
		queryKey: ["products"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("products")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) {
				throw new Error(error.message);
			}
			return data || [];
		},
	});
}

export function useReels() {
	return useQuery<Reel[]>({
		queryKey: ["reels"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("reels")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) {
				throw new Error(error.message);
			}
			return data || [];
		},
	});
}

export function useOffers() {
	return useQuery<Offer[]>({
		queryKey: ["offers"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("offers")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) {
				throw new Error(error.message);
			}
			return data || [];
		},
	});
}
