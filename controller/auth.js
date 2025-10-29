import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";

export const registerUser = async (req, res) => {
  console.log("👤 Received registration request:", req.body);
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    const html = `<p>Hello ${name}, verify your email: <a href="${verifyLink}">Verify</a></p>`;

    console.log("📧 Sending verification email...");
    await sendEmail(email, "Verify Your Email", html);

    res.status(201).json({ message: "User registered. Please check." });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
