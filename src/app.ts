import express from "express";
import cors from "cors";
import datasetRoutes from "./routes/dataset.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("DataScope API is running!");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DataScope API is healthy",
  });
});

app.use("/api/datasets", datasetRoutes);

export default app;