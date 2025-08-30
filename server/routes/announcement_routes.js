// routes/announcement.js - Express.js Routes for Announcements

const express = require('express');
const router = express.Router();
const { body, validationResult, param, query } = require('express-validator');
const { Announcement, AnnouncementHelpers } = require('../models/announcement_model');

// Middleware for error handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation middleware
const validateAnnouncement = [
  body('announcement')
    .isLength({ min: 10, max: 500 })
    .withMessage('Announcement must be between 10-500 characters')
    .trim()
    .escape(),
  body('priority')
    .optional()
    .isIn(['low', 'normal', 'high', 'urgent'])
    .withMessage('Priority must be: low, normal, high, or urgent'),
  body('category')
    .optional()
    .isIn(['general', 'maintenance', 'update', 'promotion', 'alert', 'news'])
    .withMessage('Invalid category'),
  body('author')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Author name must be between 2-50 characters')
    .trim(),
  body('targetAudience')
    .optional()
    .isIn(['all', 'clients', 'internal', 'partners'])
    .withMessage('Invalid target audience'),
  body('expiresAt')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Invalid expiration date'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage('Each tag must be 1-20 characters')
    .trim()
];

const validateId = [
  param('id').isMongoId().withMessage('Invalid announcement ID')
];

// Check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// ===== ROUTES =====

// @route   GET /api/announcements
// @desc    Get all announcements with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100'),
  query('priority').optional().isIn(['low', 'normal', 'high', 'urgent']),
  query('category').optional().isIn(['general', 'maintenance', 'update', 'promotion', 'alert', 'news']),
  query('active').optional().isBoolean().withMessage('Active must be boolean'),
  query('recent').optional().isBoolean().withMessage('Recent must be boolean')
], checkValidation, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    priority,
    category,
    active,
    recent,
    targetAudience = 'all'
  } = req.query;

  let query = {};
  
  // Build query based on filters
  if (priority) query.priority = priority;
  if (category) query.category = category;
  if (active !== undefined) query.isActive = active === 'true';
  if (targetAudience) query.targetAudience = { $in: [targetAudience, 'all'] };

  // Handle recent filter
  if (recent === 'true') {
    const timeThreshold = new Date(Date.now() - (24 * 60 * 60 * 1000));
    query.timestamp = { $gte: timeThreshold };
  }

  // Handle expiration
  if (active !== 'false') {
    query.$or = [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const announcements = await Announcement.find(query)
    .sort({ priority: 1, timestamp: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .select('-readBy'); // Exclude readBy array for performance

  const total = await Announcement.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      announcements,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalAnnouncements: total,
        hasNextPage: skip + announcements.length < total,
        hasPrevPage: parseInt(page) > 1
      }
    }
  });
}));

// @route   GET /api/announcements/:id
// @desc    Get single announcement by ID
// @access  Public
router.get('/:id', validateId, checkValidation, asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  
  if (!announcement) {
    return res.status(404).json({
      success: false,
      message: 'Announcement not found'
    });
  }

  // Increment impressions
  await announcement.incrementImpressions();

  res.status(200).json({
    success: true,
    data: announcement
  });
}));

// @route   POST /api/announcements
// @desc    Create new announcement
// @access  Private (Admin only)
router.post('/', validateAnnouncement, checkValidation, asyncHandler(async (req, res) => {
  const {
    announcement,
    priority = 'normal',
    category = 'general',
    author = 'System',
    targetAudience = 'all',
    expiresAt,
    tags = []
  } = req.body;

  const newAnnouncement = new Announcement({
    announcement,
    priority,
    category,
    author,
    targetAudience,
    expiresAt,
    tags: tags.map(tag => tag.toLowerCase())
  });

  const savedAnnouncement = await newAnnouncement.save();

  res.status(201).json({
    success: true,
    message: 'Announcement created successfully',
    data: savedAnnouncement
  });
}));

// @route   PUT /api/announcements/:id
// @desc    Update announcement
// @access  Private (Admin only)
router.put('/:id', [...validateId, ...validateAnnouncement], checkValidation, asyncHandler(async (req, res) => {
  const {
    announcement,
    priority,
    category,
    author,
    targetAudience,
    expiresAt,
    tags,
    isActive
  } = req.body;

  const updatedAnnouncement = await Announcement.findByIdAndUpdate(
    req.params.id,
    {
      announcement,
      priority,
      category,
      author,
      targetAudience,
      expiresAt,
      tags: tags ? tags.map(tag => tag.toLowerCase()) : undefined,
      isActive,
      timestamp: new Date() // Update timestamp on edit
    },
    { 
      new: true, 
      runValidators: true 
    }
  );

  if (!updatedAnnouncement) {
    return res.status(404).json({
      success: false,
      message: 'Announcement not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Announcement updated successfully',
    data: updatedAnnouncement
  });
}));

// @route   PATCH /api/announcements/:id/toggle
// @desc    Toggle announcement active status
// @access  Private (Admin only)
router.patch('/:id/toggle', validateId, checkValidation, asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  
  if (!announcement) {
    return res.status(404).json({
      success: false,
      message: 'Announcement not found'
    });
  }

  announcement.isActive = !announcement.isActive;
  await announcement.save();

  res.status(200).json({
    success: true,
    message: `Announcement ${announcement.isActive ? 'activated' : 'deactivated'} successfully`,
    data: announcement
  });
}));

// @route   PATCH /api/announcements/:id/read
// @desc    Mark announcement as read by user
// @access  Private (Authenticated user)
router.patch('/:id/read', validateId, checkValidation, asyncHandler(async (req, res) => {
  const { userId } = req.body; // Should come from authenticated user
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required'
    });
  }

  const announcement = await Announcement.findById(req.params.id);
  
  if (!announcement) {
    return res.status(404).json({
      success: false,
      message: 'Announcement not found'
    });
  }

  await announcement.markAsRead(userId);

  res.status(200).json({
    success: true,
    message: 'Announcement marked as read'
  });
}));

// @route   PATCH /api/announcements/:id/click
// @desc    Increment click count
// @access  Public
router.patch('/:id/click', validateId, checkValidation, asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  
  if (!announcement) {
    return res.status(404).json({
      success: false,
      message: 'Announcement not found'
    });
  }

  await announcement.incrementClicks();

  res.status(200).json({
    success: true,
    message: 'Click recorded'
  });
}));

// @route   DELETE /api/announcements/:id
// @desc    Delete announcement
// @access  Private (Admin only)
router.delete('/:id', validateId, checkValidation, asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  
  if (!announcement) {
    return res.status(404).json({
      success: false,
      message: 'Announcement not found'
    });
  }

  await Announcement.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Announcement deleted successfully'
  });
}));

// @route   POST /api/announcements/bulk-delete
// @desc    Delete multiple announcements
// @access  Private (Admin only)
router.post('/bulk-delete', [
  body('ids')
    .isArray({ min: 1 })
    .withMessage('IDs array is required'),
  body('ids.*')
    .isMongoId()
    .withMessage('Each ID must be a valid MongoDB ObjectId')
], checkValidation, asyncHandler(async (req, res) => {
  const { ids } = req.body;

  const result = await Announcement.deleteMany({
    _id: { $in: ids }
  });

  res.status(200).json({
    success: true,
    message: `${result.deletedCount} announcement(s) deleted successfully`,
    data: {
      deletedCount: result.deletedCount
    }
  });
}));

// @route   POST /api/announcements/bulk-toggle
// @desc    Toggle multiple announcements active status
// @access  Private (Admin only)
router.post('/bulk-toggle', [
  body('ids')
    .isArray({ min: 1 })
    .withMessage('IDs array is required'),
  body('ids.*')
    .isMongoId()
    .withMessage('Each ID must be a valid MongoDB ObjectId'),
  body('isActive')
    .isBoolean()
    .withMessage('isActive must be boolean')
], checkValidation, asyncHandler(async (req, res) => {
  const { ids, isActive } = req.body;

  const result = await Announcement.updateMany(
    { _id: { $in: ids } },
    { isActive }
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} announcement(s) ${isActive ? 'activated' : 'deactivated'} successfully`,
    data: {
      modifiedCount: result.modifiedCount
    }
  });
}));

// @route   GET /api/announcements/stats
// @desc    Get announcement statistics
// @access  Private (Admin only)
router.get('/admin/stats', asyncHandler(async (req, res) => {
  const stats = await AnnouncementHelpers.getStats();

  // Additional real-time stats
  const urgentCount = await Announcement.countDocuments({ 
    priority: 'urgent', 
    isActive: true 
  });
  
  const expiringSoon = await Announcement.countDocuments({
    expiresAt: {
      $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      $gt: new Date()
    },
    isActive: true
  });

  res.status(200).json({
    success: true,
    data: {
      ...stats,
      urgentActive: urgentCount,
      expiringSoon
    }
  });
}));

// @route   GET /api/announcements/search
// @desc    Search announcements
// @access  Public
router.get('/search/:query', [
  param('query').isLength({ min: 1 }).withMessage('Search query is required'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], checkValidation, asyncHandler(async (req, res) => {
  const { query: searchQuery } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const announcements = await Announcement.find({
    $and: [
      {
        $or: [
          { announcement: { $regex: searchQuery, $options: 'i' } },
          { tags: { $in: [new RegExp(searchQuery, 'i')] } },
          { author: { $regex: searchQuery, $options: 'i' } }
        ]
      },
      { isActive: true }
    ]
  })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Announcement.countDocuments({
    $and: [
      {
        $or: [
          { announcement: { $regex: searchQuery, $options: 'i' } },
          { tags: { $in: [new RegExp(searchQuery, 'i')] } },
          { author: { $regex: searchQuery, $options: 'i' } }
        ]
      },
      { isActive: true }
    ]
  });

  res.status(200).json({
    success: true,
    data: {
      announcements,
      searchQuery,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalResults: total
      }
    }
  });
}));

// Global error handler for this router
router.use((error, req, res, next) => {
  console.error('Announcement Route Error:', error);

  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

module.exports = router;