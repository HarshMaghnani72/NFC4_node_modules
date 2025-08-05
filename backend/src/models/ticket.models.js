const mongoose = require('mongoose');
const validator = require('validator');

const ticketSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: null
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    attachments: {
        type: [String],
        validate: [
            {
                validator: function (arr) {
                    return arr.length <= 3;
                },
                message: 'Maximum of 3 attachments allowed.'
            },
            {
                validator: function (arr) {
                    return arr.every(url => validator.isURL(url));
                },
                message: 'All attachments must be valid URLs.'
            }
        ]
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved', 'closed'],
        default: 'open',
        required: true
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium',
        required: true
    },
    chat: [
        {
            sender: {
                type: mongoose.Types.ObjectId,
                ref: 'User',
                required: true
            },
            message: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ],
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;