import nodemailer from "nodemailer";
import logger from "./logger";
import dotenv from "dotenv";

dotenv.config();

console.log({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
});

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email: string, otp: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    });
    logger.info(`OTP email sent to ${email}`);
  } catch (error) {
    logger.error(`Failed to send OTP email to ${email}:`, error);
    throw error;
  }
};
