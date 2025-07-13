const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const categoryController = require('../controllers/categoryController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.post('/', upload.single('photo'), categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);
router.put('/:id', upload.single('photo'), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router; 