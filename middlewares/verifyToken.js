const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function (req, res, next) {
    //andiamoci a prendere dall'header la chiave authorization
    const token = req.header('Authorization')

    if (!token) {
        return res.status(401).send({
            statusCode: 401,
            errorType: 'Token non presente',
            message: 'Per poter utilizzare questo endpoint è necessario un token di accesso'
        })
    }

    try {
        //verifichiamo che il token sia valido
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        //il verify() come il compare() fa l'analisi inversa che 
        //in base alla nostra firma (il JWT_SECRET che abbiamo generato noi) 
        //lui va a decodificare il token e vede che se la decodifica riesce vuol dire che la firma è giusta
        //allora l'utente può accedere alle informazioni
        //accetta 2 parametri:
        //1 il token (quello che sta ricevendo dall'header)
        //2 la nostra firma digitale in .env

        req.author = verified

        next()
    } catch (e) {
        //se entra in questo catch vuol dire che il token c'è ma non è valido
        res.status(403).send({
            statusCode: 403,
            errorType: 'Token error',
            message: 'Il token è scaduto o non valido'
        })
    }
}