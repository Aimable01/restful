import dotenv from "dotenv";

dotenv.config();

import app from "./app";

import authRoutes from "./modules/auth/auth.routes";
import parkingRoutes from "./modules/parking/parking.routes";
import entryRoutes from "./modules/entries/entry.routes";

import { connectDB } from "./config/db";

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/parking", parkingRoutes);
app.use("/api/entries", entryRoutes);

app.listen(process.env.PORT!, () => {
  console.log("🚀 App running");
});
