import { NextResponse } from "next/server";

const otpStore = global.otpStore || {};
global.otpStore = otpStore;

export async function POST(req) {
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

  const { email, code } = await req.json();
  if (otpStore[email] === code) {
    delete otpStore[email];
    return NextResponse.json({ message: "OTP Verified" }, { status: 200, headers: corsHeaders });
  }

  return NextResponse.json({ message: "Invalid OTP" }, { status: 400, headers: corsHeaders });
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
