import Entry from "./entry.model";
import Parking from "../parking/parking.model";
import { calculateFee } from "../../utils/calculateFee";
import logger from "../../utils/logger";

//@ts-ignore
export const getEntries = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const entries = await Entry.find()
      .sort({ status: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Entry.countDocuments();

    res.json({
      data: entries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error("Error fetching entries", error);
    res.status(500).json({ message: "Server error while fetching entries" });
  }
};

//@ts-ignore
export const registerEntry = async (req, res) => {
  try {
    const { plateNumber, parkingCode } = req.body;

    const parking = await Parking.findOne({ code: parkingCode });

    if (!parking) {
      return res.status(404).json({
        message: "Parking not found",
      });
    }

    let parkingAvailableSpaces = parking.availableSpaces!;

    if (parkingAvailableSpaces <= 0) {
      return res.status(400).json({
        message: "No available spaces",
      });
    }

    const entry = await Entry.create({
      plateNumber,
      parkingCode,
    });

    parkingAvailableSpaces -= 1;

    logger.info(`Car entered: ${plateNumber} at ${parkingCode}`);

    res.status(201).json({
      message: "Car entered",
      ticket: entry,
    });
  } catch (error) {
    logger.error("Error registering entry", error);
    res.status(500).json({ message: "Error registering entry" });
  }
};

//@ts-ignore
export const registerExit = async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await Entry.findById(id);
    if (!entry) {
      return res.status(404).json({
        message: "Entry not found",
      });
    }

    const parking = await Parking.findOne({ code: entry.parkingCode });

    const exitDate = new Date();
    entry.exitDateTime = exitDate;

    entry.chargedAmount = calculateFee(
      entry.entryDateTime,
      exitDate,
      parking?.feePerHour!,
    );

    entry.status = "OUT";

    await entry.save();

    let parkingAvailableSpaces = parking?.availableSpaces!;

    parkingAvailableSpaces += 1;

    await parking?.save();

    logger.info(`Car exited: ${entry.plateNumber}`);

    res.json({
      message: "Car exited",
      bill: entry,
    });
  } catch (error) {
    logger.error("Error registering exit", error);
    res.status(500).json({ message: "Error registering exit" });
  }
};
