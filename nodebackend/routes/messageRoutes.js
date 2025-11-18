import express from "express";
import { auth } from "../middleware/auth.js";
import { sendMessage, getMessages } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", auth, sendMessage);
router.get("/", auth, getMessages);

export default router;
