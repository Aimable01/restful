import express from "express";

import { createParking, getParkings } from "./parking.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/", protect, createParking);
router.get("/", protect, getParkings);

export default router;
