// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/utils/db"; // ✅ Absolute path (check your tsconfig if needed)
import User from "@/models/User"; // Create this model next
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    console.log("Connecting to DB...");
    await connectToDatabase();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    return res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error in /api/auth/register:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
