import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { sendEmail } from "../utils/sendEmail.js";

console.log(sendEmail)

// Register new user and send verification email
export const registerUser = async (req, res) => {
  console.log("👤 Received registration request...");
  console.log("🧾 Body:", req.body);

  try {
    const { name, email, password } = req.body;

    console.log("🔍 Checking if user exists...");
    const existing = await User.findOne({ email });
    if (existing) {
      console.warn("⚠️ Email already exists:", email);
      return res.status(400).json({ message: "Email already exists" });
    }

    console.log("🔑 Hashing password...");
    const hashed = await bcrypt.hash(password, 10);
    console.log("🔒 Password hashed.");

    console.log("💾 Creating new user...");
    const user = await User.create({ name, email, password: hashed });
    console.log("✅ User created:", user);

    console.log("🔐 Generating verification token...");
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log("🧾 Token generated:", token);

    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    console.log("🔗 Verification link:", verifyLink);

    const html = `
      <h2>Email Verification</h2>
      <p>Hello <b>${name}</b>, please verify your email by clicking the link below:</p>
      <a href="${verifyLink}" 
         style="display:inline-block;padding:10px 20px;background:#28a745;color:white;text-decoration:none;border-radius:5px;">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `;

    console.log("📧 Sending verification email...");
    await sendEmail(email, "Verify Your Email", html);

    console.log("✅ Registration complete! Verification email sent.");

    res.status(201).json({
      message: "User registered successfully. Please check your email to verify.",
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify user email
export const verifyEmail = async (req, res) => {
  console.log("📩 Received email verification request...");
  console.log("🧾 Query:", req.query);

  try {
    const { token } = req.query;
    if (!token) {
      console.warn("⚠️ No token provided.");
      return res.status(400).json({ message: "Invalid token" });
    }

    console.log("🔍 Verifying token...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", decoded);

    console.log("🔍 Finding user by ID:", decoded.userId);
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.warn("⚠️ User not found for ID:", decoded.userId);
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      console.log("ℹ️ User already verified:", user.email);
      return res.status(400).json({ message: "Email already verified" });
    }

    console.log("✅ Marking user as verified...");
    user.verified = true;
    await user.save();

    console.log("🎉 Email verified successfully for:", user.email);

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("❌ Verification error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
