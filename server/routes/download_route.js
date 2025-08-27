// File: download_route.js
const express = require('express');
const router = express.Router();
const Tender = require('../models/tenders_model');
const path = require('path');
const fs = require('fs');

// @route   GET /api/tenders/download/:id
// @desc    Download a specific tender document by its ID (Mobile Compatible)
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const tender = await Tender.findById(req.params.id);

        if (!tender) {
            return res.status(404).json({ msg: 'Tender not found' });
        }

        if (!tender.filePath) {
            return res.status(404).json({ msg: 'No file found for this tender' });
        }

        const filePath = path.join(__dirname, '..', tender.filePath);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ msg: 'File not found on server' });
        }

        // Get file stats for proper headers
        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        
        // Get file extension to determine MIME type
        const ext = path.extname(tender.fileName).toLowerCase();
        const mimeTypes = {
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.xls': 'application/vnd.ms-excel',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.txt': 'text/plain',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png'
        };
        
        const mimeType = mimeTypes[ext] || 'application/octet-stream';

        // Set mobile-compatible headers
        res.set({
            'Content-Type': mimeType,
            'Content-Length': fileSize,
            'Content-Disposition': `attachment; filename="${tender.fileName}"`,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
            // Mobile-specific headers
            'X-Content-Type-Options': 'nosniff',
            'Access-Control-Expose-Headers': 'Content-Disposition'
        });

        // Create read stream and pipe to response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        fileStream.on('error', (err) => {
            console.error('File stream error:', err);
            if (!res.headersSent) {
                res.status(500).send('Error reading file');
            }
        });

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Tender not found' });
        }
        res.status(500).send('Server Error');
    }
});

// Alternative route for viewing files in browser (mobile-friendly)
router.get('/view/:id', async (req, res) => {
    try {
        const tender = await Tender.findById(req.params.id);

        if (!tender) {
            return res.status(404).json({ msg: 'Tender not found' });
        }

        if (!tender.filePath) {
            return res.status(404).json({ msg: 'No file found for this tender' });
        }

        const filePath = path.join(__dirname, '..', tender.filePath);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ msg: 'File not found on server' });
        }

        const ext = path.extname(tender.fileName).toLowerCase();
        const mimeTypes = {
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.txt': 'text/plain',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png'
        };
        
        const mimeType = mimeTypes[ext] || 'application/octet-stream';

        // Set headers for inline viewing
        res.set({
            'Content-Type': mimeType,
            'Content-Disposition': `inline; filename="${tender.fileName}"`,
            'Cache-Control': 'public, max-age=31536000'
        });

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;