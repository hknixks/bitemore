const multer = require("multer");
const cloudinary = require("cloudinary").v2
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const { CloudinaryStorage } = require("multer-storage-cloudinary");

dotenv.config();
const SECRET = process.env.SECRET;

cloudinary.config({
  api_key: process.env.api_key,
  cloud_name: process.env.cloud_name,
  api_secret: process.env.api_secret
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "SchoolProject",
    allowedFormat: ["png", "jpeg", "jpg", "svg", "gif"]
  }
});

const auth = async (request) => {
  const token = request.headers.authorization.split(" ")[1];
  const result = await jwt.verify(token, SECRET);
  return result;

};

const upload = multer({ storage });

module.exports = { upload, cloudinary, auth }


