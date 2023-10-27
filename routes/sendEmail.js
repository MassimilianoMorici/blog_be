const express = require('express')
const { createTransport } = require('nodemailer')
const email = express.Router()


const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'eudora86@ethereal.email',
        pass: 'vZFdKUYrJqYYNAH9pn'
    }
});

//rotta
email.post('/send-email', async (req, res) => {
    const { subject, text, to } = req.body

    const mailOptions = {
        from: 'noreply@massimilianomorici.com',
        to,
        subject,
        text
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Errore durante invio email')
        } else {
            console.log('email inviata');
            res.status(200).send('email inviata correttamente')
        }
    })
})

module.exports = email