import Entry from "../entries/entry.model";

//@ts-ignore
export const incomingCars = async (req, res) => {
  const { start, end } = req.query;

  const data = await Entry.find({
    entryDateTime: {
      $gte: new Date(start),
      $lte: new Date(end),
    },
  });

  res.json(data);
};

//@ts-ignore
export const outgoingCars = async (req, res) => {
  const { start, end } = req.query;

  const data = await Entry.find({
    exitDateTime: {
      $gte: new Date(start),
      $lte: new Date(end),
    },
    status: "OUT",
  });

  res.json(data);
};
