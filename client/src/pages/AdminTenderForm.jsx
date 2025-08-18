import React, { useState, useEffect, useRef } from "react";
import Button from "../components/Button";
import "./AdminTenderForm.css";


// This is the main form component for creating and managing tenders.
function AdminTenderForm() {
  const [formData, setFormData] = useState({
    title: "",
    deadline: "",
    tenderFile: null,
  });
  
  const [tenders, setTenders] = useState([]);
  const [editingTenderId, setEditingTenderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tenderToDelete, setTenderToDelete] = useState(null);
  const fileInputRef = useRef(null);

  // --- Fetch Tenders on Load ---
  const fetchTenders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/tenders');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTenders(data);
    } catch (err) {
      console.error("Failed to fetch tenders:", err);
      setError("Failed to load tenders. Please check your network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  // --- Form Handling ---

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setError("");
    setSuccess("");
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Resets the form and clears any success/error messages.
  const handleReset = () => {
    setFormData({
      title: "",
      deadline: "",
      tenderFile: null,
    });
    setEditingTenderId(null);
    setError("");
    setSuccess("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handles form submission for both creating and editing tenders.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const tenderData = new FormData();
    tenderData.append("title", formData.title);
    tenderData.append("deadline", formData.deadline);
    if (formData.tenderFile) {
      tenderData.append("tenderDocument", formData.tenderFile);
    }

    try {
      let response;
      if (editingTenderId) {
        // Edit existing tender via PATCH request
        response = await fetch(`http://localhost:5000/tenders/${editingTenderId}`, {
          method: 'PATCH',
          body: tenderData,
        });
      } else {
        // Create new tender via POST request
        response = await fetch('http://localhost:5000/tenders', {
          method: 'POST',
          body: tenderData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "An unexpected error occurred.");
      }

      setSuccess(`Tender ${editingTenderId ? 'updated' : 'created'} successfully!`);
      handleReset();
      fetchTenders(); // Refresh the list of tenders

    } catch (err) {
      console.error("Submission error:", err);
      setError(`Failed to ${editingTenderId ? 'update' : 'create'} tender. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Edit and Delete Handlers ---

  // Sets the form to edit mode with the selected tender's data.
  const handleEdit = (tender) => {
    setEditingTenderId(tender._id);
    setFormData({
      title: tender.title,
      deadline: tender.deadline.split('T')[0], // Format date for input field
      tenderFile: null, // Don't pre-populate the file input on edit
    });
    setError("");
    setSuccess("");
  };

  // Prompts the user with a confirmation modal before attempting to delete.
  const handleDelete = (tenderId) => {
    setTenderToDelete(tenderId);
    setShowConfirmModal(true);
  };
  
  // Confirms the deletion and sends a DELETE request to the backend.
  const confirmDelete = async () => {
    setShowConfirmModal(false);
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/tenders/${tenderToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to delete tender.");
      }

      setSuccess("Tender deleted successfully!");
      setTenderToDelete(null);
      fetchTenders(); // Refresh the list
    } catch (err) {
      console.error("Deletion error:", err);
      setError("Failed to delete tender. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render ---

  return (
    <div className="admin-form-container">
      <h1 className="admin-title">{editingTenderId ? 'Edit Tender' : 'Create New Tender'}</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tenderFile">Tender Document (Optional on edit)</label>
          <input
            type="file"
            id="tenderFile"
            name="tenderFile" 
            onChange={handleChange}
            disabled={isLoading}
            ref={fileInputRef}
          />
        </div>

        <div className="form-actions">
          <Button
            text="Cancel/Reset"
            onClick={handleReset}
            variant="secondary"
            type="button"
            disabled={isLoading}
          />
          <Button
            text={isLoading ? "Submitting..." : (editingTenderId ? 'Update Tender' : 'Create Tender')}
            variant="primary"
            type="submit"
            disabled={isLoading}
          />
        </div>
      </form>
      
      <div className="tenders-list">
        <h2 className="tenders-list-title">Existing Tenders</h2>
        {isLoading ? (
          <p>Loading tenders...</p>
        ) : (
          tenders.map((tender) => (
            <div key={tender._id} className="tender-card">
              <h3>{tender.title}</h3>
              <p>Deadline: {new Date(tender.deadline).toLocaleDateString()}</p>
              <div className="tender-actions">
                <Button 
                  text="Edit"
                  onClick={() => handleEdit(tender)} 
                  variant="secondary"
                  disabled={isLoading}
                />
                <Button 
                  text="Delete"
                  onClick={() => handleDelete(tender._id)} 
                  variant="danger"
                  disabled={isLoading}
                />
              </div>
            </div>
          ))
        )}
      </div>
      
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this tender?</p>
            <div className="modal-actions">
              <Button
                text="Cancel"
                onClick={() => setShowConfirmModal(false)}
                variant="secondary"
              />
              <Button
                text="Delete"
                onClick={confirmDelete}
                variant="danger"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTenderForm;
