import { NextResponse } from "next/server";
import Blog from "@/models/Blogs";
import connectDB from "@/lib/db";

// Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://admin-panel-six-vert.vercel.app",
  "https://websolutions-ten.vercel.app",
];

// CORS Headers Generator
const getCorsHeaders = (req) => {
  const origin = req.headers.get("origin");
  return {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin)
      ? origin
      : allowedOrigins[0],
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
};

// OPTIONS (preflight)
export async function OPTIONS(req) {
  const corsHeaders = getCorsHeaders(req);
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// Helper: Extract Blog ID (fixes Vercel/Next.js params bug)
const extractBlogId = (req, params) => {
  let blogId = params?.id;

  if (!blogId) {
    const url = new URL(req.url);
    const parts = url.pathname.split("/");
    blogId = parts[parts.length - 1];
  }

  return blogId;
};

/* -------------------------------------------------------------------------- */
/*                                   GET BLOG                                  */
/* -------------------------------------------------------------------------- */
export async function GET(req, { params }) {
  const corsHeaders = getCorsHeaders(req);

  try {
    await connectDB();

    const blogId = extractBlogId(req, params);

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

/* -------------------------------------------------------------------------- */
/*                                 DELETE BLOG                                 */
/* -------------------------------------------------------------------------- */
export async function DELETE(req, { params }) {
  const corsHeaders = getCorsHeaders(req);

  try {
    await connectDB();

    const blogId = extractBlogId(req, params);

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

/* -------------------------------------------------------------------------- */
/*                                  UPDATE BLOG                                */
/* -------------------------------------------------------------------------- */
export async function PUT(req, { params }) {
  const corsHeaders = getCorsHeaders(req);

  try {
    await connectDB();

    const blogId = extractBlogId(req, params);

    if (!blogId || blogId === "undefined" || blogId === "null") {
      return NextResponse.json(
        { error: "Valid Blog ID not provided" },
        { status: 400, headers: corsHeaders }
      );
    }

    const data = await req.json();

    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: "Title & Content are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(updatedBlog, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
