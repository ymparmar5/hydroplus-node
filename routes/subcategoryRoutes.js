const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const subcategoryController = require('../controllers/subcategoryController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.post('/', upload.single('photo'), subcategoryController.createSubcategory);
router.get('/', subcategoryController.getSubcategories);
router.get('/:id', subcategoryController.getSubcategory);
router.put('/:id', upload.single('photo'), subcategoryController.updateSubcategory);
router.delete('/:id', subcategoryController.deleteSubcategory);

module.exports = router; 