import Parking from "./parking.model";
import logger from "../../utils/logger";

//@ts-ignore
export const createParking = async (req, res) => {
  try {
    const parking = await Parking.create(req.body);
    logger.info(`Parking created: ${parking.code}`);
    res.status(201).json(parking);
  } catch (error) {
    logger.error("Error creating parking", error);
    res.status(500).json({ message: "Error creating parking" });
  }
};

//@ts-ignore
export const getParkings = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const parkings = await Parking.find().skip(skip).limit(limit);

    const total = await Parking.countDocuments();

    res.json({
      data: parkings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error("Error fetching parkings", error);
    res.status(500).json({ message: "Error fetching parkings" });
  }
};
