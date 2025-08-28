// announcement_model.js - MongoDB/Mongoose Model

const mongoose = require('mongoose');

// Announcement Schema
const announcementSchema = new mongoose.Schema({
  announcement: {
    type: String,
    required: [true, 'Announcement text is required'],
    trim: true,
    maxlength: [500, 'Announcement cannot exceed 500 characters'],
    minlength: [10, 'Announcement must be at least 10 characters long']
  },
  
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
    lowercase: true
  },
  
  category: {
    type: String,
    enum: ['general', 'maintenance', 'update', 'promotion', 'alert', 'news'],
    default: 'general',
    lowercase: true
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  expiresAt: {
    type: Date,
    default: null
  },
  
  author: {
    type: String,
    default: 'System'
  },
  
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  targetAudience: {
    type: String,
    enum: ['all', 'clients', 'internal', 'partners'],
    default: 'all'
  },
  
  metadata: {
    clickCount: {
      type: Number,
      default: 0
    },
    impressions: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
announcementSchema.index({ timestamp: -1 });
announcementSchema.index({ isActive: 1 });
announcementSchema.index({ priority: 1 });
announcementSchema.index({ category: 1 });
announcementSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for formatted timestamp
announcementSchema.virtual('formattedTimestamp').get(function() {
  return this.timestamp.toLocaleDateString() + ' at ' + 
         this.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
});

// Virtual for relative time
announcementSchema.virtual('relativeTime').get(function() {
  const now = new Date();
  const diffInMs = now - this.timestamp;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  return this.timestamp.toLocaleDateString();
});

// Virtual for checking if announcement is recent (within 24 hours)
announcementSchema.virtual('isRecent').get(function() {
  const now = new Date();
  const diffInHours = (now - this.timestamp) / (1000 * 60 * 60);
  return diffInHours <= 24;
});

// Virtual for checking if announcement is expired
announcementSchema.virtual('isExpired').get(function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

// Instance Methods
announcementSchema.methods.markAsRead = function(userId) {
  const existingRead = this.readBy.find(read => read.userId.toString() === userId.toString());
  if (!existingRead) {
    this.readBy.push({ userId, readAt: new Date() });
  }
  return this.save();
};

announcementSchema.methods.incrementClicks = function() {
  this.metadata.clickCount += 1;
  return this.save();
};

announcementSchema.methods.incrementImpressions = function() {
  this.metadata.impressions += 1;
  return this.save();
};

announcementSchema.methods.deactivate = function() {
  this.isActive = false;
  return this.save();
};

announcementSchema.methods.activate = function() {
  this.isActive = true;
  return this.save();
};

// Static Methods
announcementSchema.statics.getActiveAnnouncements = function() {
  return this.find({ 
    isActive: true,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  }).sort({ timestamp: -1 });
};

announcementSchema.statics.getAnnouncementsByPriority = function(priority) {
  return this.find({ 
    priority: priority,
    isActive: true,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  }).sort({ timestamp: -1 });
};

announcementSchema.statics.getAnnouncementsByCategory = function(category) {
  return this.find({ 
    category: category,
    isActive: true,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  }).sort({ timestamp: -1 });
};

announcementSchema.statics.getRecentAnnouncements = function(hours = 24) {
  const timeThreshold = new Date(Date.now() - (hours * 60 * 60 * 1000));
  return this.find({
    timestamp: { $gte: timeThreshold },
    isActive: true,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  }).sort({ timestamp: -1 });
};

announcementSchema.statics.getAnnouncementsForUser = function(targetAudience = 'all') {
  return this.find({
    targetAudience: { $in: [targetAudience, 'all'] },
    isActive: true,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  }).sort({ priority: 1, timestamp: -1 });
};

// Pre-save middleware
announcementSchema.pre('save', function(next) {
  // Auto-deactivate if expired
  if (this.expiresAt && new Date() > this.expiresAt) {
    this.isActive = false;
  }
  next();
});

// Create the model
const Announcement = mongoose.model('Announcement', announcementSchema);

// Sample data insertion function
const insertSampleAnnouncements = async () => {
  try {
    const sampleAnnouncements = [
      {
        announcement: "🚀 New feature release: Advanced project analytics now available! Get insights into your project performance with detailed metrics and reporting.",
        priority: "high",
        category: "update",
        author: "Development Team",
        tags: ["feature", "analytics", "new"],
        targetAudience: "all"
      },
      {
        announcement: "⚠️ Scheduled maintenance on Sunday 2AM-4AM EST. Services may be briefly interrupted. We apologize for any inconvenience.",
        priority: "urgent",
        category: "maintenance",
        author: "System Admin",
        tags: ["maintenance", "downtime"],
        targetAudience: "all",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
      },
      {
        announcement: "🎉 We're celebrating 1000+ successful projects! Thank you for trusting Kode &'Co with your digital transformation needs.",
        priority: "normal",
        category: "general",
        author: "Marketing Team",
        tags: ["milestone", "celebration", "thankyou"],
        targetAudience: "all"
      },
      {
        announcement: "💡 New blog post: '10 Best Practices for Modern Web Development' - Discover the latest trends and techniques used by our expert developers.",
        priority: "low",
        category: "news",
        author: "Content Team",
        tags: ["blog", "webdev", "best-practices"],
        targetAudience: "clients"
      },
      {
        announcement: "🔒 Important security update: Please update your passwords and enable two-factor authentication for enhanced account security.",
        priority: "high",
        category: "alert",
        author: "Security Team",
        tags: ["security", "password", "2fa"],
        targetAudience: "all",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Expires in 30 days
      }
    ];

    const existingCount = await Announcement.countDocuments();
    if (existingCount === 0) {
      await Announcement.insertMany(sampleAnnouncements);
      console.log('Sample announcements inserted successfully!');
    } else {
      console.log('Announcements already exist in database');
    }
  } catch (error) {
    console.error('Error inserting sample announcements:', error);
  }
};

// Helper functions for common operations
const AnnouncementHelpers = {
  // Create new announcement
  createAnnouncement: async (data) => {
    try {
      const announcement = new Announcement(data);
      return await announcement.save();
    } catch (error) {
      throw new Error(`Error creating announcement: ${error.message}`);
    }
  },

  // Get all active announcements with pagination
  getActiveWithPagination: async (page = 1, limit = 10) => {
    try {
      const skip = (page - 1) * limit;
      const announcements = await Announcement.getActiveAnnouncements()
        .skip(skip)
        .limit(limit);
      const total = await Announcement.countDocuments({ isActive: true });
      
      return {
        announcements,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalAnnouncements: total
      };
    } catch (error) {
      throw new Error(`Error fetching announcements: ${error.message}`);
    }
  },

  // Bulk update announcements
  bulkDeactivate: async (ids) => {
    try {
      return await Announcement.updateMany(
        { _id: { $in: ids } },
        { isActive: false }
      );
    } catch (error) {
      throw new Error(`Error deactivating announcements: ${error.message}`);
    }
  },

  // Get announcement statistics
  getStats: async () => {
    try {
      const total = await Announcement.countDocuments();
      const active = await Announcement.countDocuments({ isActive: true });
      const recent = await Announcement.countDocuments({
        timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });
      
      const priorityStats = await Announcement.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]);
      
      const categoryStats = await Announcement.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);

      return {
        total,
        active,
        recent,
        priorityStats,
        categoryStats
      };
    } catch (error) {
      throw new Error(`Error getting stats: ${error.message}`);
    }
  }
};

module.exports = {
  Announcement,
  insertSampleAnnouncements,
  AnnouncementHelpers
};

// Export for ES6 modules if needed
// export { Announcement, insertSampleAnnouncements, AnnouncementHelpers };