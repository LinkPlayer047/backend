import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const otpStore = {};

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

  return NextResponse.json({ message: "OTP sent" });
}
