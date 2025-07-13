const Category = require('../models/Category');
const path = require('path');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    let photo = req.file ? '/uploads/' + req.file.filename : '';
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required.' });
    }
    const category = new Category({ name, photo });
    await category.save();
    res.status(201).json({ success: true, message: 'Category created.', category });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    let update = { name };
    if (req.file) {
      update.photo = '/uploads/' + req.file.filename;
    }
    const category = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, message: 'Category updated.', category });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, message: 'Category deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
}; 