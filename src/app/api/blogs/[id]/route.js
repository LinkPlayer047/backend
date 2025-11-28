import { NextResponse } from "next/server";
import Blog from "@/models/Blogs";
import connectDB from "@/lib/db";

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.ADMIN_PANEL_URL || "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// CORS Preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// DELETE blog route
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    // 🔹 Debug log to check what params are received
    console.log("Params received in DELETE:", params);

    // 🔹 Get the blog ID safely
    const blogId = params.id; // ye ab sahi _id receive karega
    if (!blogId) {
      return NextResponse.json(
        { error: "Blog ID not provided in params" },
        { status: 400, headers: corsHeaders }
      );
    }

    // 🔹 Try deleting the blog
    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return NextResponse.json(
        { error: "Blog not found with ID: " + blogId },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { message: "Blog deleted successfully", deletedId: blogId },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("Error deleting blog:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
