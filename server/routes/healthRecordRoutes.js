import express from "express";
import {
  getHealthRecords,
  createHealthRecord,
  getHealthRecordById,
  updateHealthRecord,
  deleteHealthRecord,
} from "../controllers/healthRecordController.js";

const router = express.Router();

router.route("/").get(getHealthRecords).post(createHealthRecord);

router
  .route("/:id")
  .get(getHealthRecordById)
  .put(updateHealthRecord)
  .delete(deleteHealthRecord);

export default router;
