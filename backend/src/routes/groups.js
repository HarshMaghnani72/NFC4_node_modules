// backend/src/models/Group.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  type: { type: String, required: true },
});

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  memberCount: { type: Number, default: 0 },
  maxMembers: { type: Number, required: true },
  learningStyle: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  pendingMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  tasks: [taskSchema],
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;