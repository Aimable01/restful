import express from "express";

import { incomingCars, outgoingCars } from "./report.controller";

const router = express.Router();

router.get("/incoming", incomingCars);
router.get("/outgoing", outgoingCars);

export default router;
