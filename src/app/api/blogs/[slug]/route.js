import connectDB from "@/lib/db";
import Blog from "@/models/Blogs";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();

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

  const blog = await Blog.findOne({ slug: params.slug });
  if (!blog) return NextResponse.json({ message: "Not found" }, { status: 404, headers: corsHeaders });

  return NextResponse.json(blog, { headers: corsHeaders });
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
