import express from "express";

import { registerEntry, registerExit, getEntries } from "./entry.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * /api/entries:
 *  get:
 *      summary: Get all entries with pagination.
 *      tags: [Entries]
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
 *              description: List of entries
 */
router.get("/", protect, getEntries);

/**
 * @swagger
 * /api/entries/entry:
 *  post:
 *      summary: Register a car entry.
 *      tags: [Entries]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          plateNumber:
 *                              type: string
 *                          parkingCode:
 *                              type: string
 *      responses:
 *          201:
 *              description: Car entry registered successfully
 */
router.post("/entry", protect, registerEntry);

/**
 * @swagger
 * /api/entries/exit/{id}:
 *  post:
 *      summary: Register a car exit.
 *      tags: [Entries]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *            description: Entry ID
 *      responses:
 *          200:
 *              description: Car exit registered successfully
 */
router.post("/exit/:id", protect, registerExit);

export default router;
