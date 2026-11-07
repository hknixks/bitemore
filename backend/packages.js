const multer = require("multer");
const cloudinary = require("cloudinary").v2
const dotenv = require("dotenv")
const { CloudinaryStorage } = require("multer-storage-cloudinary");

dotenv.config();

cloudinary.config({
  api_key: process.env.api_key,
  cloud_name: process.env.cloud_name,
  api_secret: process.env.api_secret
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "SchoolProject",
    // Cloudinary's option is `allowed_formats`; the old `allowedFormat` key was silently ignored.
    allowed_formats: ["png", "jpeg", "jpg", "webp", "gif"]
  }
});

const imageFilter = (req, file, cb) => {
  if (/^image\/(png|jpe?g|webp|gif)$/.test(file.mimetype)) {
    return cb(null, true);
  }
  const error = new Error("Only PNG, JPG, WEBP or GIF images are allowed");
  error.status = 400;
  return cb(error);
};

const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }
});

module.exports = { upload, cloudinary }
