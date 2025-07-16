const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

exports.createProduct = async (req, res, next) => {
  try {
    const { title, description, price, categoryId, subcategoryId } = req.body;
    let images = req.files ? req.files.map(f => '/uploads/' + f.filename) : [];
    if (!title || !price || !categoryId || !subcategoryId) {
      return res.status(400).json({ success: false, message: 'Title, price, categoryId, and subcategoryId are required.' });
    }
    const product = new Product({ title, description, price, images, categoryId, subcategoryId });
    await product.save();
    res.status(201).json({ success: true, message: 'Product created.', product });
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// Partial image update: if req.files present, replace only the images at the specified indexes
exports.updateProduct = async (req, res, next) => {
  try {
    const { title, description, price, categoryId, subcategoryId, replaceIndexes } = req.body;
    let update = { title, description, price, categoryId, subcategoryId };
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    // Partial image replacement logic
    if (req.files && req.files.length > 0) {
      let images = [...product.images];
      let indexes = [];
      if (replaceIndexes) {
        // replaceIndexes should be a JSON array of indexes to replace
        try {
          indexes = JSON.parse(replaceIndexes);
        } catch (e) {
          return res.status(400).json({ success: false, message: 'Invalid replaceIndexes format. Must be JSON array.' });
        }
        if (!Array.isArray(indexes) || indexes.length !== req.files.length) {
          return res.status(400).json({ success: false, message: 'replaceIndexes must be an array matching the number of uploaded files.' });
        }
        // Replace only specified indexes
        req.files.forEach((file, i) => {
          const idx = indexes[i];
          if (typeof idx === 'number' && images[idx]) {
            // Delete old image
            const oldPath = path.join(__dirname, '..', images[idx]);
            fs.unlink(oldPath, err => {});
            images[idx] = '/uploads/' + file.filename;
          }
        });
      } else {
        // If no replaceIndexes, replace all images
        images = req.files.map(f => '/uploads/' + f.filename);
        // Delete all old images
        product.images.forEach(imgPath => {
          const oldPath = path.join(__dirname, '..', imgPath);
          fs.unlink(oldPath, err => {});
        });
      }
      update.images = images;
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, message: 'Product updated.', product: updatedProduct });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    // Delete all images
    if (product.images && product.images.length > 0) {
      product.images.forEach(imgPath => {
        const filePath = path.join(__dirname, '..', imgPath);
        fs.unlink(filePath, err => {});
      });
    }
    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    next(err);
  }
}; 