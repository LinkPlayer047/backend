import connectDB from "@/lib/db";
import Contact from "@/models/Contact";
import { sendEmail } from "@/lib/sendmail";
import { NextResponse } from "next/server";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": `${process.env.FRONTEND_URL},${process.env.ADMIN_PANEL_URL}`,
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
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Save to DB
    await Contact.create({ name, email, message });

    // Send email notification
    await sendEmail(
      process.env.EMAIL,
      "New Contact Message",
      `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    );

    return NextResponse.json(
      { message: "Message sent!" },
      { status: 201, headers: corsHeaders }
    );
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { message: "Failed to send message" },
      { status: 500, headers: corsHeaders }
    );
  }
}
