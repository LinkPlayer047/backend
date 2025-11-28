import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();

  // Dynamic CORS
  const allowedOrigins = [
    process.env.ADMIN_PANEL_URL,
    process.env.FRONTEND_URL,
    "http://localhost:3000",
  ];
  const origin = req.headers.get("origin") || "";
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (!req.body) await req.json();

  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields (username, email, password) are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400, headers: corsHeaders }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({ username, email, password: hashedPassword });

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

export async function OPTIONS(req) {
  const allowedOrigins = [
    process.env.ADMIN_PANEL_URL,
    process.env.FRONTEND_URL,
    "http://localhost:3000",
  ];
  const origin = req.headers.get("origin") || "";
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}
