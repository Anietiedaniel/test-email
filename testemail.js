import dotenv from "dotenv";
import { sendEmail } from "./utils/sendEmail.js";

dotenv.config();

(async () => {
  console.log("🧪 Starting Gmail test...");
  try {
    await sendEmail(
      "davidanieldev@gmail.com",
      "Test Email ✅",
      "<h3>This is a test email from your Gmail setup</h3>"
    );
    console.log("✅ Gmail test email sent successfully!");
  } catch (err) {
    console.error("❌ Gmail test failed:", err.message);
  }
})();
