


import express from "express";


import DailyRecord from "../models/DailyRecord.js";
const router = express.Router();
// Create record
router.post("/", async (req, res) => {
  try {
    const { uid, date, steps, distance, calories, streak_status } = req.body;
    const record = new DailyRecord({
      uid,
      date,
      steps,
      distance,
      calories,
      streak_status
    });
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all records (optionally filter by uid & date range)
router.get("/", async (req, res) => {
  try {
    const { uid, from, to } = req.query;
    const q = {};
    if (uid) q.uid = uid;
    if (from || to) q.date = {};
    if (from) q.date.$gte = new Date(from);
    if (to) q.date.$lte = new Date(to);
    const records = await DailyRecord.find(q).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single record by id
router.get("/:id", async (req, res) => {
  try {
    const rec = await DailyRecord.findById(req.params.id);
    if (!rec) return res.status(404).json({ error: "Not found" });
    res.json(rec);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update record
router.put("/:id", async (req, res) => {
  try {
    const updated = await DailyRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete record
router.delete("/:id", async (req, res) => {
  try {
    const removed = await DailyRecord.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



export default router; 
