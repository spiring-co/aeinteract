module.exports = require("multer")({
  dest: "./tmp",
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 1,
  },
});
