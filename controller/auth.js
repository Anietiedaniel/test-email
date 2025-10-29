import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";

export const registerUser = async (req, res) => {
  console.log("👤 Received registration request:", req.body);
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.warn("⚠️ Email already exists:", email);
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ name, email, password: hashed });
    console.log("✅ User created:", user);

    // Generate verification token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    const html = `
      <h2>Email Verification</h2>
      <p>Hello <b>${name}</b>, please verify your email by clicking below:</p>
      <a href="${verifyLink}" style="padding:10px 20px;background:#28a745;color:#fff;text-decoration:none;border-radius:5px;">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `;

    // Send email
    console.log("📧 Sending verification email to:", email);
    const info = await sendEmail(email, "Verify Your Email", html);
    console.log("✅ Verification email sent:", info);

    res.status(201).json({ message: "User registered. Please check your email to verify." });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
