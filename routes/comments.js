const express = require('express')
const CommentModel = require('../models/comment');
const BlogPostModel = require('../models/blogPost');
const comments = express.Router()

// GET all comments by blogPost ID
comments.get('/blogPosts/viewComments/:blogPostId', async (req, res) => {

    try {
        const blogPostId = req.params.blogPostId;
        const post = await BlogPostModel.findById(blogPostId)

        if (!post) {
            return res.status(404).send({
                statusCode: 404,
                message: "post not found"
            })
        }

        const comments = await CommentModel.find({ blogPost: blogPostId }).populate('author');
        if (!comments) {
            return res.status(404).send({
                statusCode: 404,
                message: "post not found"
            })
        }

        res.status(200).send({
            statusCode: 200,
            comments
        })

    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})


// GET a specific comment by ID
comments.get('/blogPosts/:blogPostId/viewComments/:commentId', async (req, res) => {
    try {
        const blogPostId = req.params.blogPostId;
        const commentId = req.params.commentId;

        const comment = await CommentModel.findOne({ _id: commentId, blogPost: blogPostId });

        if (!comment) {
            return res.status(404).send({
                statusCode: 404,
                message: "Commento non trovato per il post con ID " + blogPostId
            });
        }

        res.status(200).send({
            statusCode: 200,
            comment
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        });
    }
});


// GET by Title

comments.get('/blogPosts/byTitle', async (req, res) => {

    const { title } = req.query;

    try {
        const blogPostByTitle = await BlogPostModel.find({
            title: {
                $regex: title,
                $options: 'i'
            }
        })

        res.status(200).send(blogPostByTitle)

    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore Interno del server"
        })
    }
})


// POST
comments.post('/blogPosts/:id/createComment', async (req, res) => {

    const { title, content, author, blogPost } = req.body;

    const newCommentBlogPost = new CommentModel({
        title,
        content,
        author,
        blogPost
    })

    try {
        const commentBlogPost = await newCommentBlogPost.save()

        res.status(201).send({
            statusCode: 201,
            message: "Post saved successfully",
            payload: commentBlogPost
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

// PUT
comments.put('/blogPosts/:blogPostId/updateComment/:commentId', async (req, res) => {

    const blogPostId = req.params.blogPostId;
    const commentId = req.params.commentId;

    const blogPostExist = await BlogPostModel.findById(blogPostId)
    const commentExist = await CommentModel.findById(commentId)

    if (!blogPostExist) {
        return res.status(404).send({
            statusCode: 404,
            message: "This post does not exist!"
        })
    }

    if (!commentExist) {
        return res.status(404).send({
            statusCode: 404,
            message: "This comment does not exist!"
        })
    }

    try {
        const dataToUpdate = req.body;
        const result = await CommentModel.findByIdAndUpdate(commentId, dataToUpdate)

        res.status(200).send({
            statusCode: 200,
            message: "Comment replaced successfully",
            result
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})



// DELETE
comments.delete('/blogPosts/:blogPostId/deleteComment/:commentId', async (req, res) => {

    const blogPostId = req.params.blogPostId;
    const commentId = req.params.commentId;

    const blogPostExist = await BlogPostModel.findById(blogPostId)
    const commentExist = await CommentModel.findById(commentId)

    if (!blogPostExist) {
        return res.status(404).send({
            statusCode: 404,
            message: "This post does not exist!"
        })
    }

    if (!commentExist) {
        return res.status(404).send({
            statusCode: 404,
            message: "This comment does not exist!"
        })
    }

    try {
        const dataToUpdate = req.body;
        const options = { new: true };
        const result = await CommentModel.findByIdAndDelete(commentId, dataToUpdate, options)

        res.status(200).send({
            statusCode: 200,
            message: "Comment delete successfully",
            result
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

module.exports = comments