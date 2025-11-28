import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "../../../models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();

  try {
    const { username, email, password } = await req.json();

    // Validation: username, email, password required
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields (username, email, password) are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const exists = await Admin.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
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
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ message: "Signup error" }, { status: 500 });
  }
}
