import express from "express";

import { registerEntry, registerExit, getEntries } from "./entry.controller";

const router = express.Router();

router.get("/", getEntries);
router.post("/entry", registerEntry);
router.post("/exit/:id", registerExit);

export default router;
