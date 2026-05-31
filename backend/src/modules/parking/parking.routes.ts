import express from "express";

import {
  createParking,
  getParkings,
  getParkingById,
  updateParking,
  deleteParking,
} from "./parking.controller";
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

/**
 * @swagger
 * /api/parking/{id}:
 *  get:
 *      summary: Get a parking spot by ID.
 *      tags: [Parking]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *            description: Parking ID
 *      responses:
 *          200:
 *              description: Parking spot details
 */
router.get("/:id", protect, getParkingById);

/**
 * @swagger
 * /api/parking/{id}:
 *  put:
 *      summary: Update a parking spot.
 *      tags: [Parking]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *            description: Parking ID
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
 *          200:
 *              description: Parking updated successfully
 */
router.put("/:id", protect, updateParking);

/**
 * @swagger
 * /api/parking/{id}:
 *  delete:
 *      summary: Delete a parking spot.
 *      tags: [Parking]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *            description: Parking ID
 *      responses:
 *          200:
 *              description: Parking deleted successfully
 */
router.delete("/:id", protect, deleteParking);

export default router;
