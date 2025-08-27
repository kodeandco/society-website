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
  const [validationErrors, setValidationErrors] = useState({});
  const fileInputRef = useRef(null);

  // File validation constants
  const ALLOWED_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
  const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.pdf'];

  // --- Validation Functions ---
  const validateFile = (file) => {
    if (!file) return null;

    const errors = [];
    
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      errors.push('Only PNG, JPG, JPEG, and PDF files are allowed');
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.push('File size must be less than 10MB');
    }
    
    // Check file extension as backup
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
    if (!hasValidExtension) {
      errors.push('File must have a valid extension: .png, .jpg, .jpeg, or .pdf');
    }
    
    return errors.length > 0 ? errors : null;
  };

  const validateDeadline = (deadline) => {
    if (!deadline) return 'Deadline is required';
    
    const selectedDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates
    
    if (selectedDate <= today) {
      return 'Deadline must be at least 1 day in the future';
    }
    
    // Check if deadline is too far in the future (optional - 2 years limit)
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
    
    if (selectedDate > twoYearsFromNow) {
      return 'Deadline cannot be more than 2 years in the future';
    }
    
    return null;
  };

  const validateTitle = (title) => {
    if (!title || title.trim().length === 0) {
      return 'Tender title is required';
    }
    
    if (title.trim().length < 5) {
      return 'Tender title must be at least 5 characters long';
    }
    
    if (title.trim().length > 200) {
      return 'Tender title cannot exceed 200 characters';
    }
    
    return null;
  };

  // --- Fetch Tenders on Load ---
  const fetchTenders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://society-website-cpd3.onrender.com/tenders');
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
    const newValidationErrors = { ...validationErrors };
    
    // Clear previous errors for this field
    delete newValidationErrors[name];
    
    if (name === 'tenderFile' && files && files[0]) {
      const file = files[0];
      const fileErrors = validateFile(file);
      
      if (fileErrors) {
        newValidationErrors[name] = fileErrors;
        // Clear the file input if invalid
        setFormData({
          ...formData,
          [name]: null,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setFormData({
          ...formData,
          [name]: file,
        });
      }
    } else if (name === 'deadline') {
      const deadlineError = validateDeadline(value);
      if (deadlineError) {
        newValidationErrors[name] = [deadlineError];
      }
      setFormData({
        ...formData,
        [name]: value,
      });
    } else if (name === 'title') {
      const titleError = validateTitle(value);
      if (titleError) {
        newValidationErrors[name] = [titleError];
      }
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: files ? files[0] : value,
      });
    }
    
    setValidationErrors(newValidationErrors);
    setError("");
    setSuccess("");
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
    setValidationErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handles form submission for both creating and editing tenders.
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const titleError = validateTitle(formData.title);
    const deadlineError = validateDeadline(formData.deadline);
    const fileError = formData.tenderFile ? validateFile(formData.tenderFile) : null;
    
    const newValidationErrors = {};
    if (titleError) newValidationErrors.title = [titleError];
    if (deadlineError) newValidationErrors.deadline = [deadlineError];
    if (fileError) newValidationErrors.tenderFile = fileError;
    
    // For new tenders, file is required
    if (!editingTenderId && !formData.tenderFile) {
      newValidationErrors.tenderFile = ['Tender document is required for new tenders'];
    }
    
    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      setError("Please fix the validation errors before submitting.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setSuccess("");
    setValidationErrors({});

    const tenderData = new FormData();
    tenderData.append("title", formData.title.trim());
    tenderData.append("deadline", formData.deadline);
    if (formData.tenderFile) {
      tenderData.append("tenderDocument", formData.tenderFile);
    }

    try {
      let response;
      if (editingTenderId) {
        // Edit existing tender via PATCH request
        response = await fetch(`https://society-website-cpd3.onrender.com/tenders/${editingTenderId}`, {
          method: 'PATCH',
          body: tenderData,
        });
      } else {
        // Create new tender via POST request
        response = await fetch('https://society-website-cpd3.onrender.com/tenders', {
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
    setValidationErrors({});
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
      const response = await fetch(`https://society-website-cpd3.onrender.com/tenders/${tenderToDelete}`, {
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

  // Get tomorrow's date for minimum date validation
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // --- Render ---
  return (
    <div className="admin-form-container">
      <h1 className="admin-title">{editingTenderId ? 'Edit Tender' : 'Create New Tender'}</h1>
      
      {/* Instructions Panel */}
      <div className="instructions-panel">
        <h3>📋 Instructions for Creating Tenders</h3>
        <ul>
          <li><strong>Title:</strong> Must be between 5-200 characters and descriptive</li>
          <li><strong>Deadline:</strong> Must be at least 1 day from today and not more than 2 years in the future</li>
          <li><strong>Document:</strong> 
            <ul>
              <li>Accepted formats: PNG, JPG, JPEG, PDF only</li>
              <li>Maximum file size: 10MB</li>
              <li>Required for new tenders, optional when editing</li>
            </ul>
          </li>
          <li><strong>Note:</strong> All fields are validated before submission</li>
        </ul>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="tender-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">
            Tender Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a descriptive tender title (5-200 characters)"
            required
            disabled={isLoading}
            maxLength={200}
          />
          <div className="input-help">
            {formData.title.length}/200 characters
          </div>
          {validationErrors.title && (
            <div className="validation-errors">
              {validationErrors.title.map((error, index) => (
                <span key={index} className="error-text">⚠️ {error}</span>
              ))}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="deadline">
            Deadline <span className="required">*</span>
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            min={getTomorrowDate()}
            required
            disabled={isLoading}
          />
          <div className="input-help">
            Deadline must be at least 1 day from today
          </div>
          {validationErrors.deadline && (
            <div className="validation-errors">
              {validationErrors.deadline.map((error, index) => (
                <span key={index} className="error-text">⚠️ {error}</span>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="tenderFile">
            Tender Document 
            <span className="required">{editingTenderId ? '' : '*'}</span>
          </label>
          <input
            type="file"
            id="tenderFile"
            name="tenderFile" 
            onChange={handleChange}
            disabled={isLoading}
            ref={fileInputRef}
            accept=".png,.jpg,.jpeg,.pdf"
          />
          <div className="input-help">
            📎 Accepted: PNG, JPG, JPEG, PDF • Max size: 10MB
            {editingTenderId && " • Optional when editing"}
            {!editingTenderId && " • Required for new tenders"}
          </div>
          {validationErrors.tenderFile && (
            <div className="validation-errors">
              {validationErrors.tenderFile.map((error, index) => (
                <span key={index} className="error-text">⚠️ {error}</span>
              ))}
            </div>
          )}
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
            disabled={isLoading || Object.keys(validationErrors).length > 0}
          />
        </div>
      </form>
      
      <div className="tenders-list">
        <h2 className="tenders-list-title">Existing Tenders ({tenders.length})</h2>
        {isLoading ? (
          <p>Loading tenders...</p>
        ) : tenders.length === 0 ? (
          <p className="no-tenders">No tenders found. Create your first tender above!</p>
        ) : (
          tenders.map((tender) => (
            <div key={tender._id} className="tender-card">
              <h3>{tender.title}</h3>
              <p><strong>Deadline:</strong> {new Date(tender.deadline).toLocaleDateString()}</p>
              <p className="deadline-status">
                {new Date(tender.deadline) > new Date() ? 
                  <span className="active">🟢 Active</span> : 
                  <span className="expired">🔴 Expired</span>
                }
              </p>
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
            <h3>⚠️ Confirm Deletion</h3>
            <p>Are you sure you want to delete this tender? This action cannot be undone.</p>
            <div className="modal-actions">
              <Button
                text="Cancel"
                onClick={() => setShowConfirmModal(false)}
                variant="secondary"
              />
              <Button
                text="Delete Permanently"
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