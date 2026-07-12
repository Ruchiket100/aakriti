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
	show_in_carousel?: boolean;
	carousel_subtitle?: string;
	carousel_desc?: string;
	carousel_cta?: string;
	created_at: string;
	updated_at: string;
};

export type Reel = {
	id: string;
	user: string;
	label: string;
	video_url?: string;
	thumbnail_url?: string;
	likes?: string;
	views?: string;
	created_at?: string;
};

export type Offer = {
	id: string;
	label: string;
	text: string;
	cta?: string;
	accent?: string;
	created_at?: string;
};

export type CustomOrder = {
	id: string;
	name: string;
	email: string;
	phone: string;
	project_name: string;
	category: string;
	description?: string;
	dimensions?: string;
	material?: string;
	color?: string;
	quantity: number;
	file_url?: string;
	status: string;
	created_at: string;
};



const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

