import connectDB from "@/lib/db";
import Blog from "@/models/Blogs";
import { NextResponse } from "next/server";

export async function GET(req) {
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

  const blogs = await Blog.find().sort({ createdAt: -1 });
  return NextResponse.json(blogs, { headers: corsHeaders });
}

export async function POST(req) {
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

  const body = await req.json();
  if (!body.title || !body.content) {
    return NextResponse.json({ message: "Title and content are required" }, { status: 400, headers: corsHeaders });
  }

  const blog = await Blog.create(body);
  return NextResponse.json(blog, { status: 201, headers: corsHeaders });
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
