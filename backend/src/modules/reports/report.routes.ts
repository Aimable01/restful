import express from "express";

import { incomingCars, outgoingCars } from "./report.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = express.Router();

router.get("/incoming", protect, authorize("admin"), incomingCars);
router.get("/outgoing", protect, authorize("admin"), outgoingCars);

export default router;
