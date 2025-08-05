const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subjects: [{ type: String }],
    learningStyle: { type: String, enum: ['Visual', 'Auditory', 'Kinesthetic'] },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    pendingInvites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    activityScore: { type: Number, default: 0 },
    maxMembers: { type: Number, default: 5, min: 2, max: 20 },
    description: { type: String, maxlength: 500 }
});

module.exports = mongoose.model('Group', groupSchema);