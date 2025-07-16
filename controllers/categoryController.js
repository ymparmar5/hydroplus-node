const Category = require('../models/Category');
const path = require('path');
const fs = require('fs');

exports.createCategory = async (req, res, next) => {
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
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    let update = { name };
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    if (req.file) {
      // Delete old photo if exists
      if (category.photo) {
        const oldPath = path.join(__dirname, '..', category.photo);
        fs.unlink(oldPath, err => {});
      }
      update.photo = '/uploads/' + req.file.filename;
    }
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, message: 'Category updated.', category: updatedCategory });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    // Delete photo if exists
    if (category.photo) {
      const photoPath = path.join(__dirname, '..', category.photo);
      fs.unlink(photoPath, err => {});
    }
    res.json({ success: true, message: 'Category deleted.' });
  } catch (err) {
    next(err);
  }
}; 