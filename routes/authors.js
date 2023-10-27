const express = require('express')
const AuthorModel = require('../models/author')
const CommentModel = require('../models/comment')
const authors = express.Router()
const bcrypt = require('bcrypt')
require('dotenv').config()
const cloudUpload = require('../middlewares/cloudinaryAuthor')


//post con Cloudinary
authors.post('/authors/cloudUpload', cloudUpload.single('avatar'), async (req, res) => {
    try {
        res.status(200).json({ avatar: req.file.path })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore Interno del server"
        })
    }
})

// GET
authors.get('/authors', async (req, res) => {
    try {
        const authors = await AuthorModel.find()

        res.status(200).send({
            statusCode: 200,
            authors
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error"
        })
    }
})


// GET BY ID
authors.get('/authors/:authorsId', async (req, res) => {
    const { authorsId } = req.params;


    try {

        const author = await AuthorModel.findById(authorsId)
        if (!author) {
            return res.status(404).send({
                statusCode: 404,
                message: "User not found"
            })
        }

        res.status(200).send({
            statusCode: 200,
            author
        })

    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore Interno del server"
        })
    }
})

// GET all comments ID authors
authors.get('/authors/:authorId/blogPost', async (req, res) => {

    try {

        const authorId = req.params.authorId;

        // Esegui una query per ottenere tutti i commenti associati a un determinato autore
        const comments = await CommentModel.find({ author: authorId });
        if (!comments || comments.length === 0) {
            return res.status(404).send({
                statusCode: 404,
                message: "Nessun commento trovato per l'autore con ID " + authorId
            });
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




//POST
authors.post('/authors/create', async (req, res) => {

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const newAuthor = new AuthorModel({
        nome: req.body.nome,
        cognome: req.body.cognome,
        email: req.body.email,
        password: hashedPassword,
        dataDiNascita: req.body.dataDiNascita,
        avatar: req.body.avatar,
    })

    try {
        const author = await newAuthor.save()

        res.status(201).send({
            statusCode: 201,
            message: "User saved successfully!",
            payload: author
        })


    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error"
        })
    }
})


// PATCH
authors.patch('/authors/update/:authorsId', async (req, res) => {
    const { authorsId } = req.params;

    const authorExist = await AuthorModel.findById(authorsId)

    if (!authorExist) {
        return res.status(404).send({
            statusCode: 404,
            message: "This post does not exist!"
        })
    }

    try {

        const dataToUpdate = req.body;
        const options = { new: true };
        const result = await AuthorModel.findByIdAndUpdate(authorsId, dataToUpdate, options)

        res.status(200).send({
            statusCode: 200,
            message: "Post edited successfully",
            result
        })

    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore Interno del server"
        })
    }

})


// DELETE
authors.delete('/authors/delete/:authorsId', async (req, res) => {
    const { authorsId } = req.params;

    try {

        const author = await AuthorModel.findByIdAndDelete(authorsId)

        if (!authorsId) {
            return res.status(404).send({
                statusCode: 400,
                message: "Post not found or already deleted!"
            })
        }

        res.status(200).send({
            statusCode: 200,
            message: "Post deleted successfully!"

        })

    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore Interno del server"
        })
    }
})

module.exports = authors