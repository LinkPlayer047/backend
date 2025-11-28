import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": `${process.env.ADMIN_PANEL_URL}`,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// OPTIONS handler for preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function POST(req) {
  const data = await req.formData();
  const file = data.get("file");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: "blogs" },
    (err, result) => {
      if (err) {
        return resolve(
          NextResponse.json({ error: err.message }, { headers: corsHeaders })
        );
      }
      resolve(
        NextResponse.json({ url: result.secure_url }, { headers: corsHeaders })
      );
    }
  );

  return new Promise((resolve, reject) => {
    uploadStream.end(buffer);
  });
}
