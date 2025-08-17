// File: download_route.js
const express = require('express');
const router = express.Router();
const Tender = require('./models/tender_model.js'); // Import the Tender model
const path = require('path'); // Node.js built-in module for working with file paths

// @route   GET /api/tenders/download/:id
// @desc    Download a specific tender document by its ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        // Find the tender document by its ID in the database
        const tender = await Tender.findById(req.params.id);

        // Check if the tender document exists
        if (!tender) {
            return res.status(404).json({ msg: 'Tender not found' });
        }

        // Check if a file path is associated with this tender
        if (!tender.filePath) {
            return res.status(404).json({ msg: 'No file found for this tender' });
        }

        // Construct the full, absolute path to the file on the server.
        // This is crucial for res.download() to work correctly.
        // `path.join(__dirname, '..', tender.filePath)` assumes the file
        // is stored relative to your project's root directory (e.g., in a 'uploads' folder).
        const filePath = path.join(__dirname, '..', tender.filePath);

        // Use Express's built-in download method.
        // This sends the file and automatically sets the Content-Disposition header
        // to prompt the browser to download it.
        res.download(filePath, tender.fileName, (err) => {
            if (err) {
                // Handle potential errors like file not found on the server
                console.error('Download error:', err);
                res.status(500).send('Could not download the file.');
            }
        });

    } catch (err) {
        console.error(err.message);
        // Handle an invalid ID format
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Tender not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
