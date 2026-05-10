import mongoose from "mongoose";

const parkingSchema = new mongoose.Schema(
  {
    code: String,
    parkingName: String,
    availableSpaces: Number,
    location: String,
    feePerHour: Number,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Parking", parkingSchema);
