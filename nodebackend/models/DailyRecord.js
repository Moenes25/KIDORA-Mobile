// models/DailyRecord.js
import  mongoose  from "mongoose";

const DailyRecordSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true },
  date: { type: Date, required: true },
  steps: { type: Number, default: 0 },
  distance: { type: Number, default: 0 }, // meters or km - choose one
  calories: { type: Number, default: 0 },
  streak_status: { type: String, default: "" }
}, {
  timestamps: true
});


const DailyRecord = mongoose.model("DailyRecord", DailyRecordSchema);


export default    DailyRecord;