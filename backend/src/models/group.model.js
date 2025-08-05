const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subjects: [{ type: String }],
    availability: {
        start: { type: Date },
        end: { type: Date }
    },
    learningStyle: { type: String, enum: ['Visual', 'Auditory', 'Kinesthetic'] },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    pendingInvites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Group', groupSchema);