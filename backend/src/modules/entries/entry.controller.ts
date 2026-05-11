import Entry from "./entry.model";
import Parking from "../parking/parking.model";
import { calculateFee } from "../../utils/calculateFee";

//@ts-ignore
export const registerEntry = async (req, res) => {
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

  res.status(201).json({
    message: "Car entered",
    ticket: entry,
  });
};

//@ts-ignore
export const registerExit = async (req, res) => {
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

  res.json({
    message: "Car exited",
    bill: entry,
  });
};
