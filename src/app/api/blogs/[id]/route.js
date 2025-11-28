import { NextResponse } from "next/server";
import Blog from "@/models/Blogs";
import connectDB from "@/lib/db";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.ADMIN_PANEL_URL || "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// OPTIONS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// DELETE blog
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    // 🔥 ID fix: params missing ho to URL se extract kar lo
    let blogId = params?.id;

    if (!blogId) {
      const url = new URL(req.url);
      blogId = url.pathname.split("/").pop(); // last part is ID
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
