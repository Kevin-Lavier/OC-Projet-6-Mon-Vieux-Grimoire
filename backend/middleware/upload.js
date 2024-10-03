const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },

  filename: (req, file, callback) => {
    const name = file.originalname.replace(/[\s.]+/g, "_");
    const extension = MIME_TYPES[file.mimetype];

    if (!extension) {
      return callback(new Error("Format de fichier non supporté"), false);
    }

    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    if (!MIME_TYPES[file.mimetype]) {
      return callback(new Error("Format de fichier non supporté"), false);
    }
    callback(null, true);
  },
}).single("image");

module.exports.resizeImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const filePath = req.file.path;
  const fileName = req.file.filename;

  const avifFileName = fileName.replace(/\.\w+$/, ".avif");
  const outputFilePath = path.join("images", `resized_${avifFileName}`);

  sharp(filePath)
    .resize({ width: 206, height: 260 })
    .toFormat("avif")
    .toFile(outputFilePath)
    .then(() => {
      fs.unlink(filePath, () => {
        req.file.filename = avifFileName;
        req.file.path = outputFilePath;
        next();
      });
    })
    .catch((err) => {
      console.log(err);
      return next();
    });
};
