import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { sendEmail } from "../utils/sendEmail.js";

// Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email exists
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashed });

    // Create verification token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    // Email HTML template
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Email Verification</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for registering! Please verify your email by clicking the button below:</p>
        <a href="${verifyLink}" style="display: inline-block; padding: 10px 20px; background: #4CAF50; color: #fff; border-radius: 5px; text-decoration: none;">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      </div>
    `;

    await sendEmail(email, "Verify Your Email", html);

    res.status(201).json({
      message: "User registered. Please check your email to verify.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) return res.status(400).json({ message: "Invalid token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.verified)
      return res.status(400).json({ message: "Already verified" });

    user.verified = true;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
