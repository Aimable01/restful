import Entry from "../entries/entry.model";
import logger from "../../utils/logger";

//@ts-ignore
export const incomingCars = async (req, res) => {
  try {
    const { start, end } = req.query;

    const data = await Entry.find({
      entryDateTime: {
        $gte: new Date(start),
        $lte: new Date(end),
      },
    });

    logger.info(`Incoming cars report generated from ${start} to ${end}`);

    res.json(data);
  } catch (error) {
    logger.error("Error generating incoming cars report", error);
    res.status(500).json({ message: "Error generating report" });
  }
};

//@ts-ignore
export const outgoingCars = async (req, res) => {
  try {
    const { start, end } = req.query;

    const data = await Entry.find({
      exitDateTime: {
        $gte: new Date(start),
        $lte: new Date(end),
      },
      status: "OUT",
    });

    logger.info(`Outgoing cars report generated from ${start} to ${end}`);

    res.json(data);
  } catch (error) {
    logger.error("Error generating outgoing cars report", error);
    res.status(500).json({ message: "Error generating report" });
  }
};
