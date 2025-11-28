import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "../../../models/Admin";
import bcrypt from "bcryptjs";

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
    const { username, email, password } = await req.json();

    // Validation: username, email, password required
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields (username, email, password) are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if email already exists
    const exists = await Admin.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = await Admin.create({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Signup successful", email: newAdmin.email },
      { status: 201, headers: corsHeaders }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { message: "Signup error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
