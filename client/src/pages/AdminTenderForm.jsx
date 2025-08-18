import React, { useState } from "react";
import "./AdminTenderForm.css";
import Button from "../components/Button";

function AdminTenderForm() {
  const [formData, setFormData] = useState({
    title: "",
    deadline: "",
    fileUrl: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tender Data:", formData);
    alert("Tender created successfully!");
    // TODO: send data to backend instead of console.log

    // Reset form
    setFormData({
      title: "",
      deadline: "",
      fileUrl: ""
    });
  };

  const handleReset = () => {
    setFormData({
      title: "",
      deadline: "",
      fileUrl: ""
    });
  };

  return (
    <div className="admin-form-container">
      <h1 className="admin-title">Create New Tender</h1>

      <form className="tender-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Tender Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter tender title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="deadline">Deadline</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fileUrl">Tender Document (PDF Link)</label>
          <input
            type="url"
            id="fileUrl"
            name="fileUrl"
            value={formData.fileUrl}
            onChange={handleChange}
            placeholder="Paste Google Drive or PDF link"
            required
          />
        </div>

        <div className="form-actions">
          <Button
            text="Reset"
            onClick={handleReset}
            variant="secondary"
            type="button"
          />
          <Button
            text="Create Tender"
            onClick={handleSubmit}
            variant="primary"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}

export default AdminTenderForm;
