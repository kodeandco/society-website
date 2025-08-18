const express = require('express');
const router = express.Router();
const Tender = require('../models/tenders_model');
const multer = require('multer');
const path = require('path');

// --- Multer Configuration for file uploads ---
// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/', // Directory to save the uploaded files
  filename: (req, file, cb) => {
    // Save the file with its original name and a timestamp to avoid conflicts
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Initialize upload variable with Multer settings
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Set file size limit (e.g., 10MB)
  fileFilter: (req, file, cb) => {
    // Check file type to allow only certain file formats (e.g., PDF)
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Error: File upload only supports the following filetypes - ' + filetypes);
  },
}).single('tenderDocument'); // 'tenderDocument' is the name of the file input field in your form

// @route   POST /tenders
// @desc    Create a new tender with a file upload
// @access  Public (or Private depending on your auth middleware)
router.post('/', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    try {
      const { title, deadline } = req.body;
      const fileName = req.file.originalname;
      const filePath = req.file.path; // The path where Multer saved the file

      // Create a new tender instance with data from the request body and file details
      const newTender = new Tender({
        title,
        deadline,
        fileName,
        filePath,
      });

      // Save the new tender to the database
      const tender = await newTender.save();
      // Respond with the created tender and a 201 (Created) status code
      res.status(201).json(tender);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
});

// @route   GET /tenders
// @desc    Get all tenders
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Find all tenders in the database
        const tenders = await Tender.find().sort({ uploadDate: -1 }); // Sort by most recent
        res.json(tenders);
    } catch (err) {
      console.error('Database save error:', err);
      
      // Handle Mongoose validation errors with friendly messages
      if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => {
          // Convert validation errors to friendly messages
          if (e.message.includes('Title is required')) {
            return 'Please enter a title for the tender.';
          }
          if (e.message.includes('Deadline is required')) {
            return 'Please select a deadline date.';
          }
          if (e.message.includes('Title must be at least 3 characters')) {
            return 'The title is too short. Please enter at least 3 characters.';
          }
          if (e.message.includes('Deadline must be a future date')) {
            return 'The deadline must be a future date.';
          }
          return 'Please check your information and try again.';
        });
        
        return res.status(400).json({ msg: errors[0] }); // Show first error
      }
      
      // Generic database error
      res.status(500).json({ msg: 'Something went wrong while saving. Please try again in a few minutes.' });
    }
});

// @route   GET /tenders/:id
// @desc    Get a single tender by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const tender = await Tender.findById(req.params.id);

        // Check if a tender with the provided ID exists
        if (!tender) {
            return res.status(404).json({ msg: 'Tender not found' });
        }
        res.json(tender);
    } catch (err) {
        console.error(err.message);
        // Handle a common error where the ID format is invalid
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Tender not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PATCH /api/tenders/:id
// @desc    Update a tender by ID, including an optional file
// @access  Public (or Private)
router.patch('/:id', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }
    
    try {
      // The update data comes from the request body
      const updateData = { ...req.body };

      // If a new file was uploaded, update the file details
      if (req.file) {
        updateData.fileName = req.file.originalname;
        updateData.filePath = req.file.path;
      }

      const tender = await Tender.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!tender) {
        return res.status(404).json({ msg: 'Tender not found' });
      }
      res.json(tender);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Tender not found' });
      }
      res.status(500).send('Server Error');
    }
  });
});

//.put for editing the tender 

router.put('/:id', async (req, res) => {
    try {
        const tender = await Tender.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // Return the updated doc and run schema validators
        );

        if (!tender) {
            return res.status(404).json({ msg: 'Tender not found' });
        }
        res.json(tender);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Tender not found' });
        }
        res.status(500).send('Server Error');
    }
});



// @route   DELETE /tenders/:id
// @desc    Delete a tender by ID
// @access  Public (or Private)
router.delete('/:id', async (req, res) => {
    try {
        const tender = await Tender.findByIdAndDelete(req.params.id);

        if (!tender) {
            return res.status(404).json({ msg: 'Tender not found' });
        }
        res.json({ msg: 'Tender removed successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Tender not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;