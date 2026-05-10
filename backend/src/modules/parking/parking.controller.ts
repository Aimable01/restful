import Parking from "./parking.model";

//@ts-ignore
export const createParking = async (req, res) => {
  const parking = await Parking.create(req.body);

  res.status(201).json(parking);
};

//@ts-ignore
export const getParkings = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 10;

  const parkings = await Parking.find()
    .skip((page - 1) * limit)
    .limit(limit);

  res.json(parkings);
};
