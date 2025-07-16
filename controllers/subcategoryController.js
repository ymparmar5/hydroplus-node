const Subcategory = require('../models/Subcategory');
const path = require('path');
const fs = require('fs');

exports.createSubcategory = async (req, res, next) => {
  try {
    const { name, categoryId } = req.body;
    let photo = req.file ? '/uploads/' + req.file.filename : '';
    if (!name || !categoryId) {
      return res.status(400).json({ success: false, message: 'Name and categoryId are required.' });
    }
    const subcategory = new Subcategory({ name, photo, categoryId });
    await subcategory.save();
    res.status(201).json({ success: true, message: 'Subcategory created.', subcategory });
  } catch (err) {
    next(err);
  }
};

exports.getSubcategories = async (req, res, next) => {
  try {
    const { categoryId } = req.query;
    let filter = {};
    if (categoryId) filter.categoryId = categoryId;
    const subcategories = await Subcategory.find(filter);
    res.json({ success: true, subcategories });
  } catch (err) {
    next(err);
  }
};

exports.getSubcategory = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory) return res.status(404).json({ success: false, message: 'Subcategory not found.' });
    res.json({ success: true, subcategory });
  } catch (err) {
    next(err);
  }
};

exports.updateSubcategory = async (req, res, next) => {
  try {
    const { name, categoryId } = req.body;
    let update = { name, categoryId };
    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory) return res.status(404).json({ success: false, message: 'Subcategory not found.' });
    if (req.file) {
      // Delete old photo if exists
      if (subcategory.photo) {
        const oldPath = path.join(__dirname, '..', subcategory.photo);
        fs.unlink(oldPath, err => {});
      }
      update.photo = '/uploads/' + req.file.filename;
    }
    const updatedSubcategory = await Subcategory.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, message: 'Subcategory updated.', subcategory: updatedSubcategory });
  } catch (err) {
    next(err);
  }
};

exports.deleteSubcategory = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) return res.status(404).json({ success: false, message: 'Subcategory not found.' });
    // Delete photo if exists
    if (subcategory.photo) {
      const photoPath = path.join(__dirname, '..', subcategory.photo);
      fs.unlink(photoPath, err => {});
    }
    res.json({ success: true, message: 'Subcategory deleted.' });
  } catch (err) {
    next(err);
  }
}; 