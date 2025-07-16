const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');
const { uploadSingle } = require('../middleware/upload');

router.post('/', uploadSingle('photo'), subcategoryController.createSubcategory);
router.get('/', subcategoryController.getSubcategories);
router.get('/:id', subcategoryController.getSubcategory);
router.put('/:id', uploadSingle('photo'), subcategoryController.updateSubcategory);
router.delete('/:id', subcategoryController.deleteSubcategory);

module.exports = router; 