const express = require('express')
const mongoose = require('mongoose')
const blogPostsRoute = require('./routes/blogPosts')
const authorsRoute = require('./routes/authors')
const commentsRoute = require('./routes/comments')
const loginRoute = require('./routes/login')
const emailRoute = require('./routes/sendEmail')
const path = require('path')
const cors = require('cors')


require('dotenv').config()
const PORT = 5055;


const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


// middleware parser json
app.use(cors())
app.use(express.json())

// routes
app.use('/', blogPostsRoute)
app.use('/', authorsRoute)
app.use('/', commentsRoute)
app.use('/', loginRoute)
app.use('/', emailRoute)


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error during db connection'))
db.once('open', () => {
    console.log('Database successfully connected!')
})

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`))
