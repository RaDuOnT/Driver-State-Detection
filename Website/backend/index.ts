import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import express from "express";
import activitiesRoutes from "./routes/ActivitiesRoutes";
import userRouter from "./routes/UserRoutes";
import weatherRouter from "./routes/WeatherRoutes";
import { json } from "body-parser";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: "*",
  })
);

const uri = process.env.MONGO_URI || "";

mongoose.connect(uri)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

app.use(json());
app.use("/activities", activitiesRoutes);
app.use("/api/user", userRouter);
app.use("/api/weather", weatherRouter);
export default app;
