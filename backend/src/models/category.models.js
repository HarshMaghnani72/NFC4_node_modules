const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;