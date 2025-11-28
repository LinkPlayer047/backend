import connectDB from "@/lib/db";
import Contact from "@/models/Contact";
import { sendEmail } from "../../../lib/sendmail";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  const { name, email, message } = await req.json();

  await Contact.create({ name, email, message });

  await sendEmail(
    process.env.EMAIL,
    "New Contact Message",
    `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  );

  return NextResponse.json({ message: "Message sent!" });
}
