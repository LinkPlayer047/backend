import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();
  const admin = await Admin.findOne({ email });

  if (!admin) {
    return NextResponse.json({ message: "Admin not found" }, { status: 404 });
  }

  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    return NextResponse.json({ message: "Invalid password" }, { status: 400 });
  }

  const token = jwt.sign(
    { id: admin._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return NextResponse.json({
    token,
    username: admin.username,
    email: admin.email,
  });
}
