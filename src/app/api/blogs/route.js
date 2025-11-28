import connectDB from "@/lib/db";
import Blog from "@/models/Blogs";
import { NextResponse } from "next/server";

// Allowed origins for CORS
const allowedOrigins = [
  process.env.ADMIN_PANEL_URL,
  process.env.FRONTEND_URL,
  "http://localhost:3000",
];

// Function to generate CORS headers
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

    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Create blog with optional fields handled
    const newBlog = await Blog.create({
      title: body.title,
      content: body.content,
      subtitle: body.subtitle || "",         // optional
      image: body.image || "",               // optional
      author: body.author || "Anonymous",    // optional
      category: body.category || "General",  // optional
      slug: body.slug || 
        body.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(), // unique slug
    });

    return NextResponse.json(newBlog, { status: 201, headers: corsHeaders });
  } catch (err) {
    console.error("Error creating blog:", err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

// OPTIONS preflight for CORS
export async function OPTIONS(req) {
  const corsHeaders = getCorsHeaders(req);
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}
