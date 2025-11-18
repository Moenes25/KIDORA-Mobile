import mongoose from "mongoose";

const childSchema = new mongoose.Schema({
  name: String,
  age: Number,
  className: String,
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("Child", childSchema);
