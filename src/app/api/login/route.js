import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Helper: CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": `${process.env.ADMIN_PANEL_URL}`,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// OPTIONS handler for preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function POST(req) {
  await connectDB();

  try {
    const { email, password } = await req.json();

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { message: "Admin not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Compare password
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json(
      {
        token,
        username: admin.username,
        email: admin.email,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: "Login error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
