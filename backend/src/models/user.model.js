const mongoose = require('mongoose');

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
    learningStyle: { type: String, enum: ['Visual', 'Auditory', 'Kinesthetic','Mixed'] },
    studyHours: { type: Number, default: 0 },
    tasksCompleted: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    acceptInvites: { type: Boolean, default: true },
    badges: [{ type: String }],
    ratings: [{ raterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, score: Number }]
});

module.exports = mongoose.model('User', userSchema);