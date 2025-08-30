import React, { useState, useEffect } from 'react';
import './Announce.css';

// Automatically detect if running locally or in production
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://society-website-cpd3.onrender.com';

function Announce() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/announcements?active=true&limit=5&recent=true`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const result = await response.json();
      
      if (result.success && result.data.announcements) {
        // Sort announcements by priority and timestamp
        const sortedAnnouncements = result.data.announcements
          .sort((a, b) => {
            const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
              return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            return new Date(b.timestamp) - new Date(a.timestamp);
          })
          .slice(0, 5); // Show only latest 5 announcements
        
        setAnnouncements(sortedAnnouncements);
      } else {
        setError(result.message || 'Failed to fetch announcements');
      }
    } catch (err) {
      console.error('Fetch announcements error:', err);
      setError(`Unable to load announcements: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return '🚨';
      case 'high': return '⚠️';
      case 'normal': return '📋';
      case 'low': return '📝';
      default: return '📢';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'maintenance': return '🔧';
      case 'update': return '🚀';
      case 'promotion': return '🎉';
      case 'alert': return '⚠️';
      case 'news': return '📰';
      default: return '📢';
    }
  };

  if (loading) {
    return (
      <section className="card announcements">
        <h2>Announcements</h2>
        <div className="loading-state">
          <p>Loading announcements...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card announcements">
        <h2>Announcements</h2>
        <div className="error-state">
          <p>Error: {error}</p>
          <button onClick={fetchAnnouncements} className="retry-button">
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="card announcements">
      <h2>Announcements</h2>
      {announcements.length > 0 ? (
        <ul>
          {announcements.map((announcement, index) => (
            <li key={announcement._id || index} className="announcement-item">
              <span className="announcement-icon">
                {getCategoryIcon(announcement.category)}
              </span>
              <div className="announcement-content">
                <div className="announcement-header-info">
                  <strong className="announcement-title">
                    {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)} Announcement
                  </strong>
                  <span className={`priority-indicator priority-${announcement.priority}`}>
                    {getPriorityIcon(announcement.priority)} {announcement.priority.toUpperCase()}
                  </span>
                </div>
                {announcement.timestamp && (
                  <span className="announcement-date">
                    {formatDate(announcement.timestamp)}
                  </span>
                )}
                <div className="announcement-text">
                  {announcement.announcement.length > 120
                     ? `${announcement.announcement.substring(0, 120)}...`
                     : announcement.announcement}
                </div>
                {announcement.author && (
                  <div className="announcement-author">
                    — {announcement.author}
                  </div>
                )}
                {announcement.tags && announcement.tags.length > 0 && (
                  <div className="announcement-tags">
                    {announcement.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span key={tagIndex} className="tag-small">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul>
          <li>No announcements at the moment.</li>
        </ul>
      )}
             
      {/* {announcements.length > 0 && (
        <div className="view-all-announcements">
          <a href="/announcements" className="view-all-link">
            View All Announcements →
          </a>
        </div>
      )} */}
    </section>
  );
}

export default Announce;