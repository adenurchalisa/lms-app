const multer = require("multer");
const path = require("path");

exports.fileStorage = (uploadPath) =>
  multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, `public/uploads${uploadPath}`);
    },
    filename: (req, file, callback) => {
      const extension = path.extname(file.originalname);
      const uniqueId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${file.fieldname}-${uniqueId}${extension}`;
      callback(null, filename);
    },
  });
