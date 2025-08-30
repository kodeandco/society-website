import React, { useState, useEffect } from "react";
import Button from "./Button";
import "./AdminAnnounce.css";

// Automatically detect if running locally or in production
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://society-website-cpd3.onrender.com';

export default function AdminAnnounce() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    announcement: "",
    priority: "normal",
    category: "general",
    author: "Admin",
    targetAudience: "all",
    expiresAt: "",
    tags: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [stats, setStats] = useState(null);

  // Fetch announcements from backend
  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/announcements`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // Add CORS mode
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setAnnouncements(result.data.announcements || result.data || []);
      } else {
        setError(result.message || 'Failed to fetch announcements');
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements/admin/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      }
    } catch (err) {
      console.error('Stats fetch error:', err);
      // Don't set error for stats - it's not critical
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAnnouncements();
    fetchStats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      // Handle comma-separated tags
      const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
      setFormData({ ...formData, [name]: tagsArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAdd = async () => {
    if (formData.announcement.trim() === "") {
      alert("Please fill in the announcement content!");
      return;
    }

    if (formData.announcement.trim().length < 10) {
      alert("Announcement content must be at least 10 characters long!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        announcement: formData.announcement.trim(),
        priority: formData.priority,
        category: formData.category,
        author: formData.author.trim(),
        targetAudience: formData.targetAudience,
        expiresAt: formData.expiresAt || null,
        tags: Array.isArray(formData.tags) ? formData.tags : [],
      };

      console.log('Sending payload:', payload); // Debug log

      const response = await fetch(`${API_BASE_URL}/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        await fetchAnnouncements(); // Refresh the list
        await fetchStats(); // Refresh stats
        setFormData({
          announcement: "",
          priority: "normal",
          category: "general",
          author: "Admin",
          targetAudience: "all",
          expiresAt: "",
          tags: [],
        });
      } else {
        setError(result.message || 'Failed to create announcement');
      }
    } catch (err) {
      setError(`Failed to create announcement: ${err.message}`);
      console.error('Create error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (announcement) => {
    setFormData({
      announcement: announcement.announcement || "",
      priority: announcement.priority || "normal",
      category: announcement.category || "general",
      author: announcement.author || "Admin",
      targetAudience: announcement.targetAudience || "all",
      expiresAt: announcement.expiresAt ? announcement.expiresAt.split('T')[0] : "",
      tags: announcement.tags || [],
    });
    setIsEditing(true);
    setEditId(announcement._id);
  };

  const handleUpdate = async () => {
    if (formData.announcement.trim() === "") {
      alert("Please fill in the announcement content!");
      return;
    }

    if (formData.announcement.trim().length < 10) {
      alert("Announcement content must be at least 10 characters long!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        announcement: formData.announcement.trim(),
        priority: formData.priority,
        category: formData.category,
        author: formData.author.trim(),
        targetAudience: formData.targetAudience,
        expiresAt: formData.expiresAt || null,
        tags: Array.isArray(formData.tags) ? formData.tags : [],
      };

      const response = await fetch(`${API_BASE_URL}/announcements/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        await fetchAnnouncements(); // Refresh the list
        await fetchStats(); // Refresh stats
        handleCancel(); // Reset form
      } else {
        setError(result.message || 'Failed to update announcement');
      }
    } catch (err) {
      setError(`Failed to update announcement: ${err.message}`);
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        await fetchAnnouncements(); // Refresh the list
        await fetchStats(); // Refresh stats
      } else {
        setError(result.message || 'Failed to delete announcement');
      }
    } catch (err) {
      setError(`Failed to delete announcement: ${err.message}`);
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fixed the missing isActive parameter
  // eslint-disable-next-line no-unused-vars
  const handleToggleActive = async (id, currentStatus) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/announcements/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        await fetchAnnouncements(); // Refresh the list
        await fetchStats(); // Refresh stats
      } else {
        setError(result.message || 'Failed to toggle announcement status');
      }
    } catch (err) {
      setError(`Failed to toggle announcement: ${err.message}`);
      console.error('Toggle error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      announcement: "",
      priority: "normal",
      category: "general",
      author: "Admin",
      targetAudience: "all",
      expiresAt: "",
      tags: [],
    });
    setIsEditing(false);
    setEditId(null);
  };

  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'priority-urgent';
      case 'high':
        return 'priority-high';
      case 'normal':
        return 'priority-normal';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-normal';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'maintenance': return '🔧';
      case 'update': return '🚀';
      case 'promotion': return '🎉';
      case 'alert': return '⚠️';
      case 'news': return '📰';
      default: return '📢';
    }
  };

  return (
    <div className="admin-announce-container">
      <div className="admin-announce-header">
        <h1>Announcement Management</h1>
        <p>Create and manage announcements for your application</p>
        
        {/* Statistics Display */}
        {stats && (
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-number">{stats.total || 0}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.active || 0}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.recent || 0}</span>
              <span className="stat-label">Recent (24h)</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.urgentActive || 0}</span>
              <span className="stat-label">Urgent</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
          <Button text="Retry" onClick={fetchAnnouncements} variant="secondary" />
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="loading-indicator">
          <p>Loading...</p>
        </div>
      )}

      {/* Announcement Form */}
      <div className="announce-form-container">
        <h2>{isEditing ? "Edit Announcement" : "Create New Announcement"}</h2>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-select"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
            >
              <option value="general">General</option>
              <option value="maintenance">Maintenance</option>
              <option value="update">Update</option>
              <option value="promotion">Promotion</option>
              <option value="alert">Alert</option>
              <option value="news">News</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="author">Author:</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="targetAudience">Target Audience:</label>
            <select
              id="targetAudience"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              className="form-select"
            >
              <option value="all">All</option>
              <option value="clients">Clients</option>
              <option value="internal">Internal</option>
              <option value="partners">Partners</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="announcement">Announcement Content:</label>
          <textarea
            id="announcement"
            name="announcement"
            value={formData.announcement}
            onChange={handleChange}
            placeholder="Enter announcement content (10-500 characters)"
            className="form-textarea"
            rows="4"
            maxLength="500"
          />
          <small className="char-count">
            {formData.announcement.length}/500 characters
            {formData.announcement.length < 10 && formData.announcement.length > 0 && (
              <span style={{color: 'red'}}> (Minimum 10 characters required)</span>
            )}
          </small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiresAt">Expires At (Optional):</label>
            <input
              type="datetime-local"
              id="expiresAt"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated):</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
              onChange={handleChange}
              placeholder="feature, update, important"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-actions">
          {isEditing ? (
            <>
              <Button 
                text="Update Announcement"
                onClick={handleUpdate} 
                variant="primary"
                disabled={loading || formData.announcement.trim().length < 10}
              />
              <Button 
                text="Cancel"
                onClick={handleCancel} 
                variant="secondary"
                disabled={loading}
              />
            </>
          ) : (
            <Button 
              text="Add Announcement"
              onClick={handleAdd} 
              variant="primary"
              disabled={loading || formData.announcement.trim().length < 10}
            />
          )}
        </div>
      </div>

      {/* Announcements List */}
      <div className="announcements-list">
        <div className="list-header">
          <h2>Current Announcements ({announcements.length})</h2>
          <Button 
            text="Refresh"
            onClick={fetchAnnouncements} 
            variant="secondary"
            disabled={loading}
          />
        </div>
        
        {announcements.length === 0 ? (
          <div className="no-announcements">
            <p>No announcements yet. Create your first announcement above!</p>
          </div>
        ) : (
          <div className="announcements-grid">
            {announcements.map((announcement) => (
              <div key={announcement._id} className="announcement-card">
                <div className="announcement-header">
                  <div className="header-left">
                    <span className="category-icon">
                      {getCategoryIcon(announcement.category)}
                    </span>
                    <span className={`priority-badge ${getPriorityClass(announcement.priority)}`}>
                      {announcement.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="header-right">
                    <span className={`status-badge ${announcement.isActive ? 'active' : 'inactive'}`}>
                      {announcement.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="announcement-body">
                  <div className="announcement-content">
                    {announcement.announcement}
                  </div>
                  
                  {announcement.tags && announcement.tags.length > 0 && (
                    <div className="tags-container">
                      {announcement.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="announcement-meta">
                  <div className="meta-row">
                    <span><strong>Author:</strong> {announcement.author}</span>
                    <span><strong>Category:</strong> {announcement.category}</span>
                  </div>
                  <div className="meta-row">
                    <span><strong>Audience:</strong> {announcement.targetAudience}</span>
                    <span><strong>Created:</strong> {announcement.relativeTime || new Date(announcement.createdAt).toLocaleDateString()}</span>
                  </div>
                  {announcement.expiresAt && (
                    <div className="meta-row">
                      <span className={`expires ${announcement.isExpired ? 'expired' : ''}`}>
                        <strong>Expires:</strong> {new Date(announcement.expiresAt).toLocaleDateString()}
                        {announcement.isExpired && ' (EXPIRED)'}
                      </span>
                    </div>
                  )}
                  <div className="meta-row">
                    <span><strong>Views:</strong> {announcement.metadata?.impressions || 0}</span>
                    <span><strong>Clicks:</strong> {announcement.metadata?.clickCount || 0}</span>
                  </div>
                </div>
                
                <div className="announcement-actions">
                  <Button 
                    text="Edit"
                    onClick={() => handleEdit(announcement)} 
                    variant="success"
                    disabled={loading || isEditing}
                  />
                  <Button 
                    text={announcement.isActive ? "Deactivate" : "Activate"}
                    onClick={() => handleToggleActive(announcement._id, announcement.isActive)} 
                    variant={announcement.isActive ? "warning" : "success"}
                    disabled={loading}
                  />
                  <Button 
                    text="Delete"
                    onClick={() => handleDelete(announcement._id)} 
                    variant="danger"
                    disabled={loading}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}