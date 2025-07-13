const Subcategory = require('../models/Subcategory');

exports.createSubcategory = async (req, res) => {
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
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

exports.getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.query;
    let filter = {};
    if (categoryId) filter.categoryId = categoryId;
    const subcategories = await Subcategory.find(filter);
    res.json({ success: true, subcategories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

exports.getSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory) return res.status(404).json({ success: false, message: 'Subcategory not found.' });
    res.json({ success: true, subcategory });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

exports.updateSubcategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    let update = { name, categoryId };
    if (req.file) {
      update.photo = '/uploads/' + req.file.filename;
    }
    const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!subcategory) return res.status(404).json({ success: false, message: 'Subcategory not found.' });
    res.json({ success: true, message: 'Subcategory updated.', subcategory });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

exports.deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) return res.status(404).json({ success: false, message: 'Subcategory not found.' });
    res.json({ success: true, message: 'Subcategory deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
}; 