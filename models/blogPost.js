const mongoose = require('mongoose')


const BlogPostsSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiQc9dZn33Wnk-j0sXZ19f8NiMZpJys7nTlA&usqp=CAU",
    },
    readTime: {
        value: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        }
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'authorModel',
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true, strict: true })


module.exports = mongoose.model('blogPostModel', BlogPostsSchema, 'blogPosts')