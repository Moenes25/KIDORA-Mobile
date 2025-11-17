import express from "express";
import { login, register } from "../controllers/auth_controller.js";
import mail from "../middlewares/mail-check_mw.js";
import pass from "../middlewares/pass-check_mw.js";

const router = express.Router();

//? Test
// router.get('/', async (req, rs) => {
//    res.send("Auth Router : Success")
// })

//? Routes
router.post("/register", mail, pass, register);
router.post("/login", login);

export default router;