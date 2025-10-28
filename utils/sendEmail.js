import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // smtp-relay.brevo.com
      port: process.env.EMAIL_PORT,
      secure: false, // true for port 465, false for 587
      auth: {
        user: process.env.EMAIL_USER, // your Brevo login email
        pass: process.env.EMAIL_PASS, // your Brevo SMTP key
      },
      tls: {
        rejectUnauthorized: false, // helps avoid "self signed certificate" error
      },
    });

    const info = await transporter.sendMail({
      from: `"Real Estate App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to}, messageId: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
  }
};
