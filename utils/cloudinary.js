// cloudinaryConfig.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "public/img/upload", // Specify the folder path within Cloudinary
    /* format: async (req, file) => 'jpg', // Choose file format or allow any */
    public_id: (req, file) => `${file.originalname}`,
  },
});

module.exports = storage;
