import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

async function isAuthed() {
	const cookieStore = await cookies();
	return cookieStore.get("admin_session")?.value === "authenticated";
}

export async function GET() {
	if (!(await isAuthed()))
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const { data, error } = await supabaseAdmin
		.from("products")
		.select("*")
		.order("created_at", { ascending: false });
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
	if (!(await isAuthed()))
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	try {
		const formData = await req.formData();
		const file = formData.get("file") as File;

		if (!file)
			return NextResponse.json({ error: "No file" }, { status: 400 });

		// Convert the file to an ArrayBuffer for binary storage
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Insert into a 'bytea' column (e.g., named 'image_blob')
		const { data, error } = await supabaseAdmin
			.from("products")
			.insert([
				{
					name: formData.get("name"), // example extra field
					image_blob: buffer, // This saves the raw binary
					content_type: file.type, // Important: store this to display it later
				},
			])
			.select()
			.single();

		if (error) throw error;
		return NextResponse.json(data);
	} catch (err: any) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}

export async function PATCH(req: NextRequest) {
	if (!(await isAuthed()))
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const { id, ...updates } = await req.json();
	const { data, error } = await supabaseAdmin
		.from("products")
		.update({ ...updates, updated_at: new Date().toISOString() })
		.eq("id", id)
		.select()
		.single();
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
	if (!(await isAuthed()))
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const { id } = await req.json();
	const { error } = await supabaseAdmin
		.from("products")
		.delete()
		.eq("id", id);
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ ok: true });
}
