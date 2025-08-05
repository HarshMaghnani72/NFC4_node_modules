const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String },
    file: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);