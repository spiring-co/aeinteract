module.exports = require("multer")({
  dest: "./tmp",
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 1,
  },
});
