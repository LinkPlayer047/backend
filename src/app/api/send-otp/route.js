import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const otpStore = global.otpStore || {};
global.otpStore = otpStore;

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email required" }, { status: 400 });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = code;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP Code is ${code}`,
  });

  return NextResponse.json(
    { message: "OTP sent" },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.FRONTEND_URL},${process.env.ADMIN_PANEL_URL}`,
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
        "Access-Control-Allow-Origin": process.env.FRONTEND_URL || "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
