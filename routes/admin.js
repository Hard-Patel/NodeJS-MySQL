const express = require("express");
const { uploadImageController, retrieveImages, downloadImage } = require("../controllers/adminController");
const { admin } = require("../middleware/admin");
const { auth } = require("../middleware/auth");
const multer = require("multer");
const router = express.Router();

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: "./uploads/", // Specify the folder where uploaded files will be stored
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`); // Set the file name to be unique
  },
});

const upload = multer({ storage });

router.post(
  "/upload-image",
  [auth, admin, upload.single("file")],
  uploadImageController
);

router.get(
  "/list-images",
  [auth],
  retrieveImages
);

router.get(
  "/download-image",
  // [auth],
  downloadImage
);

module.exports = router;
