import express from "express";

import { registerEntry, registerExit } from "./entry.controller";

const router = express.Router();

router.post("/entry", registerEntry);
router.post("/exit/:id", registerExit);

export default router;
