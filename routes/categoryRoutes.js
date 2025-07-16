const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { uploadSingle } = require('../middleware/upload');

router.post('/', uploadSingle('photo'), categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);
router.put('/:id', uploadSingle('photo'), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router; 