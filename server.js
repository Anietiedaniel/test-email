import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
// import cookieParser from "cookie-parser";
import path from "path";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
const __dirname = path.resolve();

// MIDDLEWARES
app.use(express.json());
// app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// DB CONNECT
console.log("🌐 Connecting to MongoDB...");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ROUTES
app.use("/api/authagain", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
