import express from "express";

import { registerEntry, registerExit, getEntries } from "./entry.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/", protect, getEntries);
router.post("/entry", protect, registerEntry);
router.post("/exit/:id", protect, registerExit);

export default router;
