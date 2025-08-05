import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: String }], // Array of user IDs
});

export default mongoose.models.Group || mongoose.model("Group", GroupSchema);