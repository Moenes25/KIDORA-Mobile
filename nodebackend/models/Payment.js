import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  status: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Payment", paymentSchema);
