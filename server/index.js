import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jobsRouter from "./routes/jobs.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/jobs", jobsRouter);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    dataSource: process.env.MONGO_URI && global.__mongoConnected ? "MongoDB" : "in-memory (demo mode)",
  });
});

async function start() {
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      global.__mongoConnected = true;
      console.log("Connected to MongoDB");
    } catch (err) {
      console.warn("Could not connect to MongoDB, falling back to in-memory store:", err.message);
      global.__mongoConnected = false;
    }
  } else {
    console.log("No MONGO_URI set — running with in-memory demo data.");
    global.__mongoConnected = false;
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
