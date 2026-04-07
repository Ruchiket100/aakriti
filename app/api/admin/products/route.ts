import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

async function isAuthed() {
	const cookieStore = await cookies();
	return cookieStore.get("admin_session")?.value === "authenticated";
}

export async function GET() {
	console.log(await isAuthed());
	if (!isAuthed())
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
	const body = await req.json();
	const { data, error } = await supabaseAdmin
		.from("products")
		.insert([body])
		.select()
		.single();
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json(data);
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
	if (!isAuthed())
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
