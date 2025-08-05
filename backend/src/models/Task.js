import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: String, default: "Today" },
  visibility: { type: String, enum: ["public", "private"], default: "private" },
  by: { type: String, default: "You" },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);