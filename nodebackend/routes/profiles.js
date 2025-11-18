import express from "express";
import multer from "multer";
import path from "path";
import Profile from "../models/profile.js";
import { auth } from "../middleware/appauth.js";

const router = express.Router();

// ----- MULTER CONFIG -----
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, req.user.username + path.extname(file.originalname));
  }
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
    return cb(new Error("Only images allowed"));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 6 }
}).single("file");

// ----- Upload Image -----
router.patch("/upload", auth, (req, res) => {
  upload(req, res, async err => {
    if (err) return res.json({ success: false, err });

    try {
      const profile = await Profile.findOneAndUpdate(
        { username: req.user.username },
        { $set: { img: req.file.path } },
        { new: true }
      );

      return res.status(200).json({ success: true, profile });
    } catch (e) {
      return res.json({ success: false, err: e });
    }
  });
});

// ----- Add Profile -----
router.post("/add", auth, async (req, res) => {
  try {
    const profile = await Profile.create({
      username: req.user.username,
      name: req.body.name,
      DOB: req.body.DOB,
      profession: req.body.profession,
      titleline: req.body.titleline,
      about: req.body.about
    });

    res.status(200).json({ success: true, msg: "Profile saved", profile });
  } catch (err) {
    res.json({ success: false, err });
  }
});

// ----- Check Profile -----
router.get("/checkProfile", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ username: req.user.username });
    if (!profile) return res.json({ success: false });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
});

// ----- Get Profile Data -----
router.get("/getData", auth, async (req, res) => {
  try {
    const result = await Profile.findOne({ username: req.user.username });
    return res.status(200).json({ success: true, data: result || [] });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
});

// ----- Update Profile -----
router.patch("/update", auth, async (req, res) => {
  try {
    const result = await Profile.findOneAndUpdate(
      { username: req.user.username },
      req.body,
      { new: true }
    );

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
});

export default router;
