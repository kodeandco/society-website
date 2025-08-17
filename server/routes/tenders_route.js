const express = require('express');
const router = express.Router();
const Tender = require('../models/tenders_model'); // Import the Mongoose model you created

// --- TENDER API ROUTES ---

// @route   POST /api/tenders
// @desc    Create a new tender
// @access  Public (or Private depending on your auth middleware)
router.post('/', async (req, res) => {
    try {
        // Create a new tender instance with data from the request body
        const newTender = new Tender({
            title: req.body.title,
            description: req.body.description,
            fileName: req.body.fileName,
            filePath: req.body.filePath // This would typically come from a file upload process
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

// @route   GET /api/tenders
// @desc    Get all tenders
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Find all tenders in the database
        const tenders = await Tender.find().sort({ uploadDate: -1 }); // Sort by most recent
        res.json(tenders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/tenders/:id
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
// @desc    Update a tender by ID
// @access  Public (or Private)
router.patch('/:id', async (req, res) => {
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

// @route   DELETE /api/tenders/:id
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
