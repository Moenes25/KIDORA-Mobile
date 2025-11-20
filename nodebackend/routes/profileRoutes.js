import express from "express";
import { createProfile, getProfile, updateProfile } from "../controllers/ProfileController.js";

const router = express.Router();

router.post("/create", createProfile);
router.get("/id/:emailp", getProfile);
router.put("/:email", updateProfile);

router.get("/:email", async (req, res) => {
  try {
    const p = await Profile.findOne({ email: req.params.email });
    res.json(p);
  } catch (err) {
    res.status(500).json(null);
  }
});

router.get("/:usernamedata/h", async (req, res) => {
  try {
    const p = await Profile.findOne({ username: req.params.username });
    res.json(p);
  } catch (err) {
    res.status(500).json(null);
  }
});

export default router;
