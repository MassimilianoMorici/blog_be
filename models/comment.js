const mongoose = require('mongoose')


const CommentsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'authorModel',
        required: true
    },
    blogPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blogPostModel',
        required: true
    }
}, { timestamps: true, strict: true })


module.exports = mongoose.model('commentModel', CommentsSchema, 'comments')