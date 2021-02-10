const mongoose = require('mongoose');

const Comment = mongoose.model(
    "Comment",
    new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        },
        text: String,
        createdAt: {
            type: Date,
            default: Date.now()
        }
    })
);

module.exports = Comment;