import { NextResponse } from "next/server";

const otpStore = global.otpStore || {};
global.otpStore = otpStore;

export async function POST(req) {
  const { email, code } = await req.json();

  if (otpStore[email] === code) {
    delete otpStore[email];
    return NextResponse.json(
      { message: "OTP Verified" },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": `${process.env.ADMIN_PANEL_URL}`,
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }

  return NextResponse.json(
    { message: "Invalid OTP" },
    {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ADMIN_PANEL_URL}`,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}

// Preflight OPTIONS request
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ADMIN_PANEL_URL}`,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
