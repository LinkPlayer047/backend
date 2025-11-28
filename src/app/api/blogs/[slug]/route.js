import connectDB from "@/lib/db";
import Blog from "../../../../models/Blogs";
import { NextResponse } from "next/server";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": `${process.env.FRONTEND_URL},${process.env.ADMIN_PANEL_URL}`,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// OPTIONS handler for preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function GET(req, { params }) {
  await connectDB();
  const blog = await Blog.findOne({ slug: params.slug });

  if (!blog) {
    return NextResponse.json(
      { message: "Not found" },
      { status: 404, headers: corsHeaders }
    );
  }

  return NextResponse.json(blog, { headers: corsHeaders });
}
