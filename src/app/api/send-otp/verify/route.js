import { NextResponse } from "next/server";

const otpStore = global.otpStore || {};

export async function POST(req) {
  const { email, code } = await req.json();

  if (otpStore[email] === code) {
    delete otpStore[email];
    return NextResponse.json({ message: "OTP Verified" });
  }

  return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
}
