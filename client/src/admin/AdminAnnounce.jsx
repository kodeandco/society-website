import React, { useState, useEffect } from "react";
import Button from "./Button";
import "./AdminAnnounce.css";

export default function AdminAnnounce() {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    priority: "Medium",
    title: "",
    content: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Load announcements from localStorage on component mount
  useEffect(() => {
    const savedAnnouncements = localStorage.getItem("announcements");
    if (savedAnnouncements) {
      setAnnouncements(JSON.parse(savedAnnouncements));
    }
  }, []);

  // Save announcements to localStorage whenever announcements change
  useEffect(() => {
    localStorage.setItem("announcements", JSON.stringify(announcements));
  }, [announcements]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdd = () => {
    if (formData.content.trim() !== "" && formData.title.trim() !== "") {
      const newAnnouncement = {
        ...formData,
        date: formData.date || new Date().toISOString().split('T')[0],
        id: Date.now(), // Simple ID generation
        createdAt: new Date().toLocaleString()
      };
      
      setAnnouncements([...announcements, newAnnouncement]);
      setFormData({ 
        date: "", 
        priority: "Medium", 
        title: "", 
        content: "" 
      });
    } else {
      alert("Please fill title and content!");
    }
  };

  const handleEdit = (index) => {
    setFormData(announcements[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleUpdate = () => {
    if (formData.content.trim() !== "" && formData.title.trim() !== "") {
      const updatedAnnouncements = [...announcements];
      updatedAnnouncements[editIndex] = {
        ...formData,
        id: announcements[editIndex].id,
        createdAt: announcements[editIndex].createdAt,
        updatedAt: new Date().toLocaleString()
      };
      
      setAnnouncements(updatedAnnouncements);
      setFormData({ 
        date: "", 
        priority: "Medium", 
        title: "", 
        content: "" 
      });
      setIsEditing(false);
      setEditIndex(null);
    } else {
      alert("Please fill title and content!");
    }
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      const updatedAnnouncements = announcements.filter((_, i) => i !== index);
      setAnnouncements(updatedAnnouncements);
    }
  };

  const handleCancel = () => {
    setFormData({ 
      date: "", 
      priority: "Medium", 
      title: "", 
      content: "" 
    });
    setIsEditing(false);
    setEditIndex(null);
  };

  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  return (
    <div className="admin-announce-container">
      <div className="admin-announce-header">
        <h1>Announcement Management</h1>
        <p>Create and manage announcements for your application</p>
      </div>

      {/* Announcement Form */}
      <div className="announce-form-container">
        <h2>{isEditing ? "Edit Announcement" : "Create New Announcement"}</h2>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter announcement title"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Enter announcement content"
            className="form-textarea"
            rows="4"
          />
        </div>

        <div className="form-actions">
          {isEditing ? (
            <>
              <Button 
                text="Update Announcement"
                onClick={handleUpdate} 
                variant="primary"
              />
              <Button 
                text="Cancel"
                onClick={handleCancel} 
                variant="secondary"
              />
            </>
          ) : (
            <Button 
              text="Add Announcement"
              onClick={handleAdd} 
              variant="primary"
            />
          )}
        </div>
      </div>

      {/* Announcements List */}
      <div className="announcements-list">
        <h2>Current Announcements ({announcements.length})</h2>
        
        {announcements.length === 0 ? (
          <div className="no-announcements">
            <p>No announcements yet. Create your first announcement above!</p>
          </div>
        ) : (
          <div className="announcements-grid">
            {announcements.map((announcement, index) => (
              <div key={announcement.id || index} className="announcement-card">
                <div className="announcement-header">
                  <span className={`priority-badge ${getPriorityClass(announcement.priority)}`}>
                    {announcement.priority}
                  </span>
                  <span className="announcement-date">
                    {announcement.date || new Date().toISOString().split('T')[0]}
                  </span>
                </div>
                
                <h3 className="announcement-title">{announcement.title}</h3>
                <p className="announcement-content">{announcement.content}</p>
                
                <div className="announcement-meta">
                  <small>
                    Created: {announcement.createdAt}
                    {announcement.updatedAt && (
                      <><br />Updated: {announcement.updatedAt}</>
                    )}
                  </small>
                </div>
                
                <div className="announcement-actions">
                  <Button 
                    text="Edit"
                    onClick={() => handleEdit(index)} 
                    variant="success"
                    disabled={isEditing}
                  />
                  <Button 
                    text="Delete"
                    onClick={() => handleDelete(index)} 
                    variant="danger"
                    disabled={isEditing}
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