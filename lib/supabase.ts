import { createClient } from "@supabase/supabase-js";

export type Product = {
	id: string;
	name: string;
	category: string;
	price: number;
	tag: string;
	rating: number;
	reviews: number;
	description: string;
	size: string;
	material: string;
	delivery_days: string;
	images: string[];
	in_stock: boolean;
	created_at: string;
	updated_at: string;
};

export const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const supabaseAdmin = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
