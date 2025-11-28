import connectDB from "@/lib/db";
import Blog from "@/models/Blogs";
import { NextResponse } from "next/server";

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

export async function GET() {
  await connectDB();
  const blogs = await Blog.find().sort({ createdAt: -1 });
  return NextResponse.json(blogs, { headers: corsHeaders });
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  if (!body.title || !body.content) {
    return NextResponse.json(
      { message: "Title and content are required" },
      { status: 400, headers: corsHeaders }
    );
  }

  const blog = await Blog.create(body);
  return NextResponse.json(blog, { status: 201, headers: corsHeaders });
}
