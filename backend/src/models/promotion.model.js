const mongoose = require('mongoose');
const validator = require('validator');
const promotionRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    requestedAt: { type: Date, default: Date.now },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    reason: { type: String, required: true }
});
module.exports = mongoose.model('PromotionRequest', promotionRequestSchema);