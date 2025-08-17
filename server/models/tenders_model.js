const mongoose = require('mongoose');

// This defines the structure of a tender document in the MongoDB database.
const tenderSchema = new mongoose.Schema({
    // The tender's title. This is a required field.
    title: {
        type: String,
        required: [true, 'Title is required for a tender.'],
        trim: true, // Trims whitespace from the beginning and end of the string
        minlength: [3, 'Title must be at least 3 characters long.']
    },
    // A detailed description of the tender.
    description: {
        type: String,
        required: false, // This field is optional.
        trim: true
    },
    // The name of the file that was uploaded, useful for displaying to the user.
    fileName: {
        type: String,
        required: false
    },
    // The path or URL where the uploaded file is stored.
    // In a real-world application, this would point to a cloud storage service
    // like Amazon S3, Google Cloud Storage, or a local server path.
    filePath: {
        type: String,
        required: false
    },
    // The date and time the tender was uploaded.
    uploadDate: {
        type: Date,
        default: Date.now // Sets the default value to the current date and time.
    }
}, {
    // Adds `createdAt` and `updatedAt` timestamps automatically.
    timestamps: true
});

// Create and export the Mongoose model based on the schema.
// The model will be named 'Tender' and will create a collection named 'tenders' in MongoDB.
const Tender = mongoose.model('Tender', tenderSchema);

module.exports = Tender;
