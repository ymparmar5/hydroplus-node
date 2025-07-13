const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
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
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { title, description, price, categoryId, subcategoryId } = req.body;
    let update = { title, description, price, categoryId, subcategoryId };
    if (req.files && req.files.length > 0) {
      update.images = req.files.map(f => '/uploads/' + f.filename);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product updated.', product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
}; 