import mongoose from "mongoose";

const dailyReportSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child" },
  sleep: String,
  food: String,
  mood: String,
  activity: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("DailyReport", dailyReportSchema);
