import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastname: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    role: {
      type: String,
      enum: ["admin", "attendant"],
      default: "attendant",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
