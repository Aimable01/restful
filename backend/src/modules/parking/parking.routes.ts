import express from "express";

import { createParking, getParkings } from "./parking.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * /api/parking:
 *  post:
 *      summary: Create a new parking spot.
 *      tags: [Parking]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code:
 *                              type: string
 *                          parkingName:
 *                              type: string
 *                          availableSpaces:
 *                              type: number
 *                          location:
 *                              type: string
 *                          feePerHour:
 *                              type: number
 *      responses:
 *          201:
 *              description: Parking created successfully
 */
router.post("/", protect, createParking);

/**
 * @swagger
 * /api/parking:
 *  get:
 *      summary: Get all parking spots with pagination.
 *      tags: [Parking]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *            description: Page number
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *            description: Items per page
 *      responses:
 *          200:
 *              description: List of parking spots
 */
router.get("/", protect, getParkings);

export default router;
