import connectDB from "@/lib/db";
import Contact from "@/models/Contact";
import { sendEmail } from "@/lib/sendmail";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

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

  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400, headers: corsHeaders });
    }

    await Contact.create({ name, email, message });

    await sendEmail(process.env.EMAIL, "New Contact Message", `Name: ${name}\nEmail: ${email}\nMessage: ${message}`);

    return NextResponse.json({ message: "Message sent!" }, { status: 201, headers: corsHeaders });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ message: "Failed to send message" }, { status: 500, headers: corsHeaders });
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
