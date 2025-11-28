import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function POST(req) {
  const allowedOrigins = [
    process.env.ADMIN_PANEL_URL,
    process.env.FRONTEND_URL,
    "http://localhost:3000",
  ];
  const origin = req.headers.get("origin") || "";
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  const data = await req.formData();
  const file = data.get("file");
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "blogs" },
      (err, result) => {
        if (err) return reject(NextResponse.json({ error: err.message }, { headers: corsHeaders }));
        resolve(NextResponse.json({ url: result.secure_url }, { headers: corsHeaders }));
      }
    );
    uploadStream.end(buffer);
  });
}

export async function OPTIONS(req) {
  const allowedOrigins = [
    process.env.ADMIN_PANEL_URL,
    process.env.FRONTEND_URL,
    "http://localhost:3000",
  ];
  const origin = req.headers.get("origin") || "";
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}
