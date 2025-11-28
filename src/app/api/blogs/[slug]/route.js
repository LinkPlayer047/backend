import { NextResponse } from "next/server";
import Blog from "@/models/Blog";  // <-- your model
import connectDB from "@/lib/connectDB"; // <-- your DB connect

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.ADMIN_PANEL_URL || "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Preflight (VERY IMPORTANT)
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const slug = params.slug;

    const deleted = await Blog.findByIdAndDelete(slug);

    if (!deleted) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, message: "Blog deleted successfully" },
      { status: 200, headers: corsHeaders }
    );

  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
