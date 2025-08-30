import React, { useState, useEffect } from 'react';
import './Announce.css';
function Announce() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Load announcements from localStorage
    const savedAnnouncements = localStorage.getItem('announcements');
    if (savedAnnouncements) {
      const parsed = JSON.parse(savedAnnouncements);
      // Sort by priority and date, show only latest 5 for homepage
      const sorted = parsed
        .sort((a, b) => {
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          }
          return new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt);
        })
        .slice(0, 5); // Show only first 5 announcements
      setAnnouncements(sorted);
    }
  }, []);

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '🚨';
      case 'medium': return '📋';
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

  return (
    <section className="card announcements">
      <h2>Announcements</h2>
      {announcements.length > 0 ? (
        <ul>
          {announcements.map((announcement, index) => (
            <li key={announcement.id || index} className="announcement-item">
              <span className="announcement-icon">
                {getPriorityIcon(announcement.priority)}
              </span>
              <div className="announcement-content">
                <strong>{announcement.title}</strong>
                {announcement.date && (
                  <span className="announcement-date">
                    {formatDate(announcement.date)}
                  </span>
                )}
                <div className="announcement-text">
                  {announcement.content.length > 100 
                    ? `${announcement.content.substring(0, 100)}...` 
                    : announcement.content}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul>
          <li>No announcements at the moment.</li>
        </ul>
      )}
      
      {announcements.length > 0 && (
        <div className="view-all-announcements">
          <a href="/announcements" className="view-all-link">
            View All Announcements →
          </a>
        </div>
      )}
    </section>
  );
}

export default Announce;