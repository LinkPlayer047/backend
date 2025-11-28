import connectDB from "@/lib/db";
import Blog from "@/models/Blogs";
import { NextResponse } from "next/server";

// Allowed origins
const allowedOrigins = [
  process.env.ADMIN_PANEL_URL,
  process.env.FRONTEND_URL,
  "http://localhost:3000",
];

// Utility function to generate CORS headers
const getCorsHeaders = (req) => {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
};

// GET all blogs
export async function GET(req) {
  await connectDB();

  const corsHeaders = getCorsHeaders(req);

  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json(blogs, { headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

// POST a new blog
export async function POST(req) {
  await connectDB();

  const corsHeaders = getCorsHeaders(req);

  try {
    const body = await req.json();

    if (!body.title || !body.content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const blog = await Blog.create(body);
    return NextResponse.json(blog, { status: 201, headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

// DELETE a blog by ID
export async function DELETE(req, { params }) {
  await connectDB();

  const corsHeaders = getCorsHeaders(req);

  try {
    const { id } = params;
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({ message: "Blog deleted" }, { status: 200, headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

// OPTIONS preflight
export async function OPTIONS(req) {
  const corsHeaders = getCorsHeaders(req);
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}
