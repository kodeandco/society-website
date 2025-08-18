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
    
    // The deadline for tender submission
    deadline: {
        type: Date,
        required: [true, 'Deadline is required for a tender.'],
        validate: {
            validator: function(value) {
                // Ensure deadline is in the future
                return value > new Date();
            },
            message: 'Deadline must be a future date.'
        }
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
    },
    // Status of the tender (active, closed, cancelled)
    status: {
        type: String,
        enum: ['active', 'closed', 'cancelled'],
        default: 'active'
    }
}, {
    // Adds `createdAt` and `updatedAt` timestamps automatically.
    timestamps: true
});

// Index for better query performance
tenderSchema.index({ deadline: 1, status: 1 });
tenderSchema.index({ uploadDate: -1 });

// Virtual field to check if tender is expired
tenderSchema.virtual('isExpired').get(function() {
    return this.deadline < new Date();
});

// Create and export the Mongoose model based on the schema.
// The model will be named 'Tender' and will create a collection named 'tenders' in MongoDB.
const Tender = mongoose.model('Tender', tenderSchema);

module.exports = Tender;