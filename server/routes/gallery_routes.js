const express = require('express');
const router = express.Router();
const Gallery = require('../models/gallery_model');

// POST route to create a new gallery item
// Example request body: { "image": "https://example.com/image.jpg", "category": "nature" }
router.post('/', async (req, res) => {
  try {
    const { image, category } = req.body;
    
    // Create and save the new gallery item
    const newGalleryItem = await Gallery.create({
      image,
      category,
    });
    
    res.status(201).json(newGalleryItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET route to fetch all gallery items, sorted by category first, then by creation date
// Optional category filter: //galleries?category=nature
// Optional grouped response: //galleries?grouped=true (returns items grouped by category)
router.get('/', async (req, res) => {
  try {
    const { category, grouped } = req.query;
    let filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    // Sort by category first (alphabetically), then by creation date (newest first)
    const galleryItems = await Gallery.find(filter)
      .sort({ category: 1, createdAt: -1 });
    
    // If grouped=true, return items organized by category
    if (grouped === 'true') {
      const groupedItems = galleryItems.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {});
      
      // Convert to array format with category info
      const categorizedItems = Object.keys(groupedItems)
        .sort() // Sort category names alphabetically
        .map(categoryName => ({
          category: categoryName,
          items: groupedItems[categoryName],
          count: groupedItems[categoryName].length
        }));
      
      return res.json(categorizedItems);
    }
    
    res.json(galleryItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET route to fetch all unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Gallery.distinct('category');
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Gallery.countDocuments({ category });
        return { category, count };
      })
    );
    
    // Sort categories alphabetically
    categoriesWithCount.sort((a, b) => a.category.localeCompare(b.category));
    
    res.json(categoriesWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT route to update a gallery item by its ID
// The :id in the image is the unique ID of the document you want to update.
// Example image: //galleries/60c72b2f9b1d8e001f3e7b1a
// Example request body: { "image": "https://example.com/updated-image.jpg", "category": "urban" }
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { image, category } = req.body;
    
    // findByIdAndUpdate finds a document by its _id and updates it.
    // { new: true } returns the updated document instead of the original one.
    const updatedGalleryItem = await Gallery.findByIdAndUpdate(
      id,
      { image, category },
      { new: true, runValidators: true }
    );
    
    if (!updatedGalleryItem) {
      return res.status(404).json({ message: 'Gallery item not found.' });
    }
    
    res.json(updatedGalleryItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE route to delete a gallery item by its ID
// The :id in the image is the unique ID of the document you want to delete.
// Example image: //galleries/60c72b2f9b1d8e001f3e7b1a
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // findByIdAndDelete finds a document by its _id and removes it.
    const deletedGalleryItem = await Gallery.findByIdAndDelete(id);
    
    if (!deletedGalleryItem) {
      return res.status(404).json({ message: 'Gallery item not found.' });
    }
    
    res.json({ message: 'Gallery item deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;