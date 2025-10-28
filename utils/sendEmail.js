import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    console.log("📧 Preparing to send email...");

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // false for TLS, true for SSL (port 465)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("🧠 Transporter created successfully.");

    const info = await transporter.sendMail({
      from: `"Auth System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent successfully to ${to}`);
    console.log("📨 Message ID:", info.messageId);
    console.log("📬 Response:", info.response);

    return info;
  } catch (error) {
    console.error("❌ Email sending error:", error);
    throw new Error("Email failed to send");
  }
};
