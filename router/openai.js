const express = require("express");
const router = express.Router();
const { generateBlogFromImage } = require("../Controller/openaiController");

// Support multipart file upload via multer + Cloudinary storage
// Support multipart file upload via multer (memory storage - do NOT save)
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/generate-blog-from-image",
  upload.single("image"),
  generateBlogFromImage
);

module.exports = router;
