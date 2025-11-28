import { NextResponse } from "next/server";
import Blog from "@/models/Blogs";
import connectDB from "@/lib/db";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.ADMIN_PANEL_URL || "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// OPTIONS preflight for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// DELETE blog by ID
export async function DELETE(req, { params }) {
  try {
    // Connect to MongoDB
    await connectDB();

    console.log("DELETE params:", params); // Debug: check in Vercel logs

    const blogId = params?.id;

    if (!blogId) {
      return NextResponse.json(
        { error: "Blog ID not provided in params" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Delete blog from DB
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
    console.error("DELETE ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
