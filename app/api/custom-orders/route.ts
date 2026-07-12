import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		// Validate required fields
		const { name, email, phone, project_name, category } = body;
		if (!name || !email || !phone || !project_name || !category) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		// Insert using the admin client to bypass RLS issues automatically
		const { data, error } = await supabaseAdmin
			.from("custom_orders")
			.insert([
				{
					name,
					email,
					phone,
					project_name,
					category,
					description: body.description || "",
					dimensions: body.dimensions || "",
					material: body.material || "PLA",
					color: body.color || "Default",
					quantity: parseInt(body.quantity) || 1,
					file_url: body.file_url || "",
					status: "pending",
				},
			])
			.select()
			.single();

		if (error) {
			throw error;
		}

		return NextResponse.json(data);
	} catch (err: any) {
		console.error("Custom order submission error:", err);
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
