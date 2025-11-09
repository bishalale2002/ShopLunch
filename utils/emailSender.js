// utils/emailSender.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); // Make sure environment variables are loaded

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASS.replace(/\s/g, ""), // Remove any accidental spaces
  },
});

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject
 * @param {string} text - Plaintext content
 */
export const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"Bidding Admin" <${process.env.ADMIN_EMAIL}>`,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err.message);
  }
};
