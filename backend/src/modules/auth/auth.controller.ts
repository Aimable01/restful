import User from "../users/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/generateToken";
import { sendOTPEmail } from "../../utils/email";
import logger from "../../utils/logger";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

//@ts-ignore
export const register = async (req, res) => {
  const { firstName, lastName, email, role, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({
      message: "Email already in use.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = generateOTP();

  const user = await User.create({
    firstName,
    lastName,
    email,
    role,
    password: hashedPassword,
    otp,
    otpExpires: new Date(Date.now() + 10 * 60 * 1000),
  });

  try {
    await sendOTPEmail(email, otp);
  } catch (error) {
    logger.error("Failed to send OTP email during registration", error);
  }

  res.status(201).json({
    message: "User registered. OTP sent to email",
    user: { firstName, lastName, email, role },
  });
};

//@ts-ignore
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  if (user.otp !== otp || new Date() > user.otpExpires!) {
    return res.status(400).json({
      message: "Invalid or expired OTP",
    });
  }

  user.otp = undefined;
  user.otpExpires = undefined;
  user.isVerified = true;
  await user.save();

  res.json({
    message: "OTP verified successfully",
  });
};

//@ts-ignore
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const inDBUserPassword = user.password!;

  const match = await bcrypt.compare(password, inDBUserPassword);
  if (!match) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const token = generateToken(user);

  logger.info(`User logged in: ${email}`);

  res.json({
    message: "Login successful",
    token,
    user,
  });
};
