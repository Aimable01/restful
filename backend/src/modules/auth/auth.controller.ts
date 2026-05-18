import User from "../users/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/generateToken";

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

  const user = await User.create({
    firstName,
    lastName,
    email,
    role,
    password: hashedPassword,
  });

  res.status(201).json({
    message: "User registered",
    user,
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

  // first get the user saved in database password
  const inDBUserPassword = user.password!;

  const match = await bcrypt.compare(password, inDBUserPassword);
  if (!match) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const token = generateToken(user);

  res.json({
    message: "Login successful",
    token,
    user,
  });
};
