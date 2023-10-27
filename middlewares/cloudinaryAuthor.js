const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
require('dotenv').config()


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// configurazione cloudinary
const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "avatarAuthorsCloud", //nome cartella cloud
        format: async (req, file) => 'png',
        public_id: (req, file) => file.name
    }
})


const cloudUpload = multer({ storage: cloudStorage })

module.exports = cloudUpload;


