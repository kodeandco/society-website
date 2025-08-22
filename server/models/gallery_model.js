const mongoose = require('mongoose');

// Define the schema for a single gallery item
const gallerySchema = new mongoose.Schema({
  // 'base64' is used to store the image data as a string.
  base64: {
    type: String,
    required: true,
  },
  // 'category' is a string to store the selected category.
  category: {
    type: String,
    required: true,
  },
}, {
  // 'timestamps: true' automatically adds 'createdAt' and 'updatedAt' fields.
  timestamps: true 
});

// Create and export the Mongoose model
const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;