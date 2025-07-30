const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String, 
    content: String,
    author: { type: mongoose.Schema. Types.ObjectId, ref: 'Users'},
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Post', postSchema);