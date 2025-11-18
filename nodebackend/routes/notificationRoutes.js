import express from "express";
import { auth } from "../middleware/auth.js";
import { createNotif, getNotifs } from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", auth, createNotif);
router.get("/:userId", auth, getNotifs);

export default router;
