const mongoose = require('mongoose');
const studyPlanSchema = new mongoose.Schema({
  tasks: [{
    title: String,
    dueDate: Date,
    type: String
  }],
  schedule: [{
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    time: Date,
    duration: String,
    title: String
  }],
  resources: [{
    subject: String,
    url: String,
    type: String
  }],
  createdAt: { type: Date, default: Date.now }
});
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  institute: { type: String, required: true },
  subjects: [{ type: String }],
  language: { type: String },
  availability: {
    start: { type: Date },
    end: { type: Date }
  },
  learningStyle: { type: String, enum: ['Visual', 'Auditory', 'Kinesthetic', 'Mixed'] },
  studyHours: { type: Number, default: 0 },
  tasksCompleted: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  acceptInvites: { type: Boolean, default: true },
  rewards: [{
    type: { type: String, enum: ['Coupon', 'TutorSession', 'PremiumAccess'] },
    value: { type: String },
    awardedAt: { type: Date, default: Date.now }
  }],
  studyPlans: [{
    tasks: [{ title: String, dueDate: Date, type: String }],
    schedule: [{ groupId: mongoose.Schema.Types.ObjectId, time: Date, duration: String, title: String }],
    resources: [{ subject: String, url: String, type: String }]
  }],
  ratings: [{ raterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, score: Number }],
  matchHistory: [{
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    timestamp: { type: Date, default: Date.now },
    scores: [Number]
  }]
});

module.exports = mongoose.model('User', userSchema);