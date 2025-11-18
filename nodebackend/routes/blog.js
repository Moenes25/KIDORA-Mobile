import express from "express";
import Blog from "../models/Blog.js";
import { auth } from "../middleware/appauth.js";

const router = express.Router();

// Add Blog
router.post("/add", auth, async (req, res) => {
  try {
    const blog = await Blog.create({
      username: req.user.username,
      title: req.body.title,
      body: req.body.body
    });

    return res.status(200).json({ success: true, msg: "Blog saved", blog });
  } catch (err) {
    return res.json({ success: false, err });
  }
});

// Get All Blogs (User Only)
router.get("/getData", auth, async (req, res) => {
  try {
    const result = await Blog.find({ username: req.user.username });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
});

export default router;
