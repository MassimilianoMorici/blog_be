const express = require('express')
const BlogPostModel = require('../models/blogPost')
const blogPosts = express.Router()
require('dotenv').config()
const cloudUpload = require('../middlewares/cloudinaryBlogPost')


//post con Cloudinary
blogPosts.post('/blogPosts/cloudUpload', cloudUpload.single('cover'), async (req, res) => {
    try {
        res.status(200).json({ cover: req.file.path })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore Interno del server"
        })
    }
})



// GET
blogPosts.get('/blogPosts', async (req, res) => {

    const { page = 1, pageSize = 4 } = req.query

    try {
        const blogPosts = await BlogPostModel.find()
            .populate('author')
            .limit(pageSize)
            .skip((page - 1) * pageSize)


        const totalBlogPost = await BlogPostModel.count()

        res.status(200)
            .send({
                statusCode: 200,
                currentPage: Number(page),
                totalPages: Math.ceil(totalBlogPost / pageSize),
                totalBlogPost,
                blogPosts
            })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})


// GET BY TITLE
blogPosts.get('/blogPosts/bytitle', async (req, res) => {
    const { title } = req.query;
    const { page = 1, pageSize = 4 } = req.query;

    try {
        const skipAmount = (page - 1) * pageSize;

        const blogPostByTitle = await BlogPostModel.find({
            title: {
                $regex: title,
                $options: 'i'
            }
        })
            .populate('author')
            .skip(skipAmount)
            .limit(pageSize);

        const totalBlogPostByTitle = await BlogPostModel.countDocuments({
            title: {
                $regex: title,
                $options: 'i'
            }
        });

        res.status(200).send({
            statusCode: 200,
            currentPage: Number(page),
            totalPages: Math.ceil(totalBlogPostByTitle / pageSize),
            totalBlogPost: totalBlogPostByTitle,
            blogPostByTitle
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        });
    }
});




// GET BY DATE
blogPosts.get('/blogPosts/bydate/:date', async (req, res) => {
    const { date } = req.params

    try {
        const getBlogPostByDate = await BlogPostModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: [
                                    { $dayOfMonth: '$createdAt' },
                                    { $dayOfMonth: new Date(date) }
                                ]
                            },
                            {
                                $eq: [
                                    { $month: '$createdAt' },
                                    { $month: new Date(date) }
                                ]
                            },
                            {
                                $eq: [
                                    { $year: '$createdAt' },
                                    { $year: new Date(date) }
                                ]
                            }
                        ]
                    }
                }
            }
        ])

        res.status(200).send(getBlogPostByDate)
    } catch (e) {

    }
})


// GET BY ID
blogPosts.get('/blogPosts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const blogPost = await BlogPostModel.findById(id)
            .populate('author')
        if (!blogPost) {
            return res.status(404).send({
                statusCode: 404,
                message: "post not found"
            })
        }

        res.status(200).send({
            statusCode: 200,
            blogPost
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})


// POST
blogPosts.post('/blogPosts/create', async (req, res) => {

    const { category, title, cover, readTime, author, content } = req.body;

    const newBlogPost = new BlogPostModel({
        category,
        title,
        cover,
        readTime,
        author,
        content,
    })

    try {
        const blogPost = await newBlogPost.save()

        res.status(201).send({
            statusCode: 201,
            message: "Post saved successfully",
            payload: blogPost
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})


// PATCH
blogPosts.patch('/blogPosts/update/:blogPostId', async (req, res) => {
    const { blogPostId } = req.params;

    const blogPostExist = await BlogPostModel.findById(blogPostId)

    if (!blogPostExist) {
        return res.status(404).send({
            statusCode: 404,
            message: "This post does not exist!"
        })
    }

    try {
        const dataToUpdate = req.body;
        const options = { new: true };
        const result = await BlogPostModel.findByIdAndUpdate(blogPostId, dataToUpdate, options)

        res.status(200).send({
            statusCode: 200,
            message: "Post edited successfully",
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
blogPosts.delete('/blogPosts/delete/:blogPostId', async (req, res) => {
    const { blogPostId } = req.params;

    try {
        const blogPost = await BlogPostModel.findByIdAndDelete(blogPostId)
        if (!blogPost) {
            return res.status(404).send({
                statusCode: 404,
                message: "Post not found or already deleted!"
            })
        }

        res.status(200).send({
            statusCode: 200,
            message: "Post deleted successfully"
        })

    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

module.exports = blogPosts