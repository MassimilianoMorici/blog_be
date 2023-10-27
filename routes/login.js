const express = require('express')
const login = express.Router()
const bcrypt = require('bcrypt')
const AuthorModel = require('../models/author')
const jwt = require('jsonwebtoken')
require('dotenv').config()


login.post('/login', async (req, res) => {

    const author = await AuthorModel.findOne({ email: req.body.email })

    if (!author) {
        return res.status(404).send({
            statusCode: 404,
            message: 'Nome utente errato o inesistente'
        })
    }


    const validPassword = await bcrypt.compare(req.body.password, author.password)

    if (!validPassword) {
        return res.status(400).send({
            statusCode: 400,
            message: 'Email o password errati o inesistenti'
        })
    }

    //generazione token
    const token = jwt.sign({
        id: author._id,
        nome: author.nome,
        cognome: author.cognome,
        email: author.email,
        dataDiNascita: author.dataDiNascita,
        avatar: author.avatar
    }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    })

    res.header('Authorization', token).status(200).send({
        statusCode: 200,
        message: 'login effettutato con successo',
        token
    })
})

module.exports = login;