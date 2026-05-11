import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
  {
    plateNumber: String,
    parkingCode: String,
    entryDateTime: {
      type: Date,
      default: Date.now(),
    },
    exitDateTime: {
      type: Date,
      default: null,
    },
    chargedAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "IN",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Entry", entrySchema);
