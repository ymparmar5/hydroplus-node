const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String }, // path to photo
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema); 