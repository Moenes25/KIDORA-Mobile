import express from "express";
import { auth } from "../middleware/auth.js";
import { addPayment, getPayments } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", auth, addPayment);
router.get("/:parentId", auth, getPayments);

export default router;
