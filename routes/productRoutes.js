const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { uploadMultiple } = require('../middleware/upload');

router.post('/', uploadMultiple('images', 10), productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.put('/:id', uploadMultiple('images', 10), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router; 