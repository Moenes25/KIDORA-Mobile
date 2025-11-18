import express from "express";
import { auth } from "../middleware/auth.js";
import { createChild, getChildren } from "../controllers/childController.js";

const router = express.Router();

router.post("/", auth, createChild);
router.get("/", auth, getChildren);

export default router;
