import { NextResponse } from "next/server";
import Blog from "@/models/Blogs";
import connectDB from "@/lib/db";

// Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://admin-panel-six-vert.vercel.app",
  "https://websolutions-ten.vercel.app",
];

// Helper function to generate CORS headers
const getCorsHeaders = (req) => {
  const origin = req.headers.get("origin");
  return {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
};

// OPTIONS preflight
export async function OPTIONS(req) {
  const corsHeaders = getCorsHeaders(req);
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// GET single blog (missing in original code)
export async function GET(req, { params }) {
  const corsHeaders = getCorsHeaders(req);

  try {
    await connectDB();

    const blogId = params?.id;
    if (!blogId) {
      return NextResponse.json(
        { error: "Blog ID not provided" },
        { status: 400, headers: corsHeaders }
      );
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(blog, { status: 200, headers: corsHeaders });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE blog
export async function DELETE(req, { params }) {
  const corsHeaders = getCorsHeaders(req);

  try {
    await connectDB();

    let blogId = params?.id;
    if (!blogId) {
      const url = new URL(req.url);
      blogId = url.pathname.split("/").pop();
    }

    if (!blogId || blogId === "undefined" || blogId === "null") {
      return NextResponse.json(
        { error: "Valid Blog ID not provided" },
        { status: 400, headers: corsHeaders }
      );
    }

    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT blog (update)
export async function PUT(req, { params }) {
  const corsHeaders = getCorsHeaders(req);

  try {
    await connectDB();

    let blogId = params?.id;
    if (!blogId) {
      const url = new URL(req.url);
      blogId = url.pathname.split("/").pop();
    }

    if (!blogId || blogId === "undefined" || blogId === "null") {
      return NextResponse.json(
        { error: "Valid Blog ID not provided" },
        { status: 400, headers: corsHeaders }
      );
    }

    const body = await req.json();

    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(updatedBlog, { status: 200, headers: corsHeaders });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
