import { Router } from "express";
import { getDatasetRecords } from "../controllers/dataset.controller.js";

const router = Router();

router.get("/:datasetId/records", getDatasetRecords);

export default router;