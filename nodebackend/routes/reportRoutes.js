import express from "express";
import { auth } from "../middleware/auth.js";
import { addReport, getReports } from "../controllers/reportController.js";

const router = express.Router();

router.post("/", auth, addReport);
router.get("/:childId", auth, getReports);

export default router;
