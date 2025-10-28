// utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  console.log("📧 Preparing to send email...");
  console.log("➡️ To:", to);
  console.log("➡️ Subject:", subject);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS, // app password (not your normal gmail password)
      },
    });

    console.log("🧠 Transporter created successfully.");

    const mailOptions = {
      from: `"Real Estate App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    console.log("📨 Sending email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log("📩 Message ID:", info.messageId);

  } catch (error) {
    console.error("❌ Email sending error:", error);
    throw new Error("Email failed to send");
  }
};
