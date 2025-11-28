import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.ADMIN_PANEL_URL || "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// Upload route
export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file"); // <-- FIXED (Frontend sends 'image')

    if (!file) {
      return NextResponse.json(
        { error: "No image received. Use formData.append('image', file)" },
        { status: 400, headers: corsHeaders }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using stream
    const uploadedImage = await new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: "blogs" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      upload.end(buffer);
    });

    return NextResponse.json(
      { url: uploadedImage.secure_url },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
