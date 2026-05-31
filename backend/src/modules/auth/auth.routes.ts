import express from "express";
import { register, login, verifyOTP } from "./auth.controller";

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
 *                          firstName:
 *                              type: string
 *                          lastName:
 *                              type: string
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *                          role:
 *                              type: string
 *                              enum: [admin, attendant]
 *      responses:
 *          201:
 *              description: User registered successfully
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/verify-otp:
 *  post:
 *      summary: Verify OTP for user registration.
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
 *                          otp:
 *                              type: string
 *      responses:
 *          200:
 *              description: OTP verified successfully
 */
router.post("/verify-otp", verifyOTP);

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *      summary: Login a user.
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
 *          200:
 *              description: Login successful
 */
router.post("/login", login);

export default router;
