import dotenv from "dotenv";

dotenv.config();

import app from "./app";

import swaggerUi from "swagger-ui-express";

import authRoutes from "./modules/auth/auth.routes";
import parkingRoutes from "./modules/parking/parking.routes";
import entryRoutes from "./modules/entries/entry.routes";

import { connectDB } from "./config/db";
import { specs } from "./docs/swagger";

connectDB();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/auth", authRoutes);
app.use("/api/parking", parkingRoutes);
app.use("/api/entries", entryRoutes);

app.listen(process.env.PORT!, () => {
  console.log("🚀 App running");
});
