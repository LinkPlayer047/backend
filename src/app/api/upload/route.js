import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function POST(req) {
  const data = await req.formData();
  const file = data.get("file");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const upload = await cloudinary.uploader.upload_stream({ folder: "blogs" });

  return new Promise((resolve, reject) => {
    upload.end(buffer);

    upload.on("finish", () => {
      resolve(
        NextResponse.json({ url: upload.url })
      );
    });
    upload.on("error", (err) =>
      reject(NextResponse.json({ error: err.message }))
    );
  });
}
