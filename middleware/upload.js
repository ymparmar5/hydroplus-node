const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only images are allowed!'));
};

const limits = { fileSize: 2 * 1024 * 1024 }; // 2MB

const upload = multer({ storage, fileFilter, limits });

module.exports = {
  uploadSingle: (field) => upload.single(field),
  uploadMultiple: (field, maxCount = 10) => upload.array(field, maxCount),
  upload // for custom use
}; 