import express from "express";

import { incomingCars, outgoingCars } from "./report.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = express.Router();

/**
 * @swagger
 * /api/reports/incoming:
 *  get:
 *      summary: Get incoming cars report by date range.
 *      tags: [Reports]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: query
 *            name: start
 *            required: true
 *            schema:
 *              type: string
 *              format: date
 *            description: Start date
 *          - in: query
 *            name: end
 *            required: true
 *            schema:
 *              type: string
 *              format: date
 *            description: End date
 *      responses:
 *          200:
 *              description: Incoming cars report
 */
router.get("/incoming", protect, authorize("admin"), incomingCars);

/**
 * @swagger
 * /api/reports/outgoing:
 *  get:
 *      summary: Get outgoing cars report by date range.
 *      tags: [Reports]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: query
 *            name: start
 *            required: true
 *            schema:
 *              type: string
 *              format: date
 *            description: Start date
 *          - in: query
 *            name: end
 *            required: true
 *            schema:
 *              type: string
 *              format: date
 *            description: End date
 *      responses:
 *          200:
 *              description: Outgoing cars report
 */
router.get("/outgoing", protect, authorize("admin"), outgoingCars);

export default router;
