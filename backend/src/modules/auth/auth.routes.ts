import express from "express";
import { register, login } from "./auth.controller";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *  post:
 *      summary: Register a new user.
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          201:
 *              description: User registered successfully
 */
router.post("/register", register);
router.post("/login", login);

export default router;
