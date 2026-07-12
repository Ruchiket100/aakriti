import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		// Convert File to Buffer for Supabase Upload
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Generate a clean, unique file path under custom-uploads/ folder
		const fileExt = file.name.split(".").pop();
		const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
		const filePath = `custom-uploads/${fileName}`;

		// Upload the file to Supabase storage bucket 'aakriti-media'
		const bucketName = "aakriti-media";
		const { error } = await supabaseAdmin.storage
			.from(bucketName)
			.upload(filePath, buffer, {
				contentType: file.type,
				upsert: true,
			});

		if (error) {
			throw error;
		}

		// Get the public URL of the uploaded custom asset
		const { data: { publicUrl } } = supabaseAdmin.storage
			.from(bucketName)
			.getPublicUrl(filePath);

		return NextResponse.json({ url: publicUrl });
	} catch (err: any) {
		console.error("Public media upload error:", err);
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
