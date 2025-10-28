import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import { sendEmail } from "./utils/sendEmail.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);


app.get("/api/test-email", async (req, res) => {
  try {
    await sendEmail("anietienteabasi123@gmail.com", "SMTP Test", "<h3>✅ SMTP working!</h3>");
    res.json({ message: "Email sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root route
app.get("/", (req, res) => res.send("✅ Email Verification Backend Running"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
