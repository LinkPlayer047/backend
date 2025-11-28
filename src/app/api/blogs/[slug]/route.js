import connectDB from "@/lib/db";
import Blog from "../../../../models/Blogs";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();
  const blog = await Blog.findOne({ slug: params.slug });
  if (!blog) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(blog);
}
