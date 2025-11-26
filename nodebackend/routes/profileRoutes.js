import express from "express";
import { createProfile, getProfile, updateProfile } from "../controllers/ProfileController.js";
import Profile from "../models/profile.js";
const router = express.Router();

router.post("/create", createProfile);
//router.get("/id/:emailp", getProfile);
router.put("/:username", updateProfile);


router.get("/:username", async (req, res) => {
  console.log("Requested:", req.params.username);
  try {
    const p = await Profile.findOne({ username: req.params.username });
    console.log("Found profile:", p);
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json(null);
  }
});


/*router.get("/user/:usernamedata/h", async (req, res) => {
  try {
    const p = await Profile.findOne({ username: req.params.username });
    res.json(p);
  } catch (err) {
    res.status(500).json(null);
  }
});
*/

export default router;
