import React, { useState, useRef } from "react";
import "./AdminTenderForm.css";
import Button from "../components/Button";

function AdminTenderForm() {
  const [formData, setFormData] = useState({
    title: "",
    deadline: "",
    tenderFile: null,
  });
  
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Function to convert technical errors to user-friendly messages
  const getUserFriendlyError = (errorMessage) => {
    const message = errorMessage.toLowerCase();
    
    if (message.includes('file too large') || message.includes('limit_file_size')) {
      return "The file you selected is too big. Please choose a file smaller than 10MB.";
    }
    
    if (message.includes('file upload only supports') || message.includes('invalid file type')) {
      return "Please upload only PDF, JPEG, JPG, or PNG files.";
    }
    
    if (message.includes('no file uploaded') || message.includes('select a file')) {
      return "Please select a file to upload.";
    }
    
    if (message.includes('title is required') || message.includes('enter a title')) {
      return "Please enter a title for the tender.";
    }
    
    if (message.includes('deadline is required') || message.includes('select a deadline')) {
      return "Please select a deadline date.";
    }
    
    if (message.includes('deadline must be a future date') || message.includes('future date')) {
      return "The deadline must be a future date. Please select a date that hasn't passed yet.";
    }
    
    if (message.includes('title must be at least 3 characters') || message.includes('too short')) {
      return "The title is too short. Please enter at least 3 characters.";
    }
    
    if (message.includes('validation error')) {
      return "Please check your information and make sure all fields are filled correctly.";
    }
    
    if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
      return "Cannot connect to the server. Please check your internet connection and try again.";
    }
    
    if (message.includes('500') || message.includes('server error')) {
      return "Something went wrong on our end. Please try again in a few minutes.";
    }
    
    if (message.includes('404')) {
      return "The service is not available right now. Please try again later.";
    }
    
    // Default friendly message for unknown errors
    return "Something went wrong. Please check your information and try again.";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    // Clear any previous errors when user starts typing/selecting
    setError("");
    setSuccess("");
    
    // Handle file input
    if (name === 'tenderFile' && files && files[0]) {
      const file = files[0];
      
      // Check file size (10MB = 10,000,000 bytes)
      if (file.size > 10000000) {
        setError("The file you selected is too big. Please choose a file smaller than 10MB.");
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload only PDF, JPEG, JPG, or PNG files.");
        return;
      }
      
      setFormData({
        ...formData,
        [name]: file,
      });
    } else {
      setFormData({
        ...formData,
        [name]: files ? files[0] : value,
      });
    }
  };

  const validateForm = () => {
    // Check if title is provided and long enough
    if (!formData.title || formData.title.trim().length < 3) {
      setError("Please enter a title that's at least 3 characters long.");
      return false;
    }
    
    // Check if deadline is provided
    if (!formData.deadline) {
      setError("Please select a deadline date.");
      return false;
    }
    
    // Check if deadline is in the future
    const deadlineDate = new Date(formData.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    if (deadlineDate <= today) {
      setError("The deadline must be a future date. Please select a date that hasn't passed yet.");
      return false;
    }
    
    // Check if file is selected
    if (!formData.tenderFile) {
      setError("Please select a file to upload.");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validate form before submitting
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Use FormData to send both text fields and the file
      const tenderData = new FormData();
      tenderData.append("title", formData.title.trim());
      tenderData.append("deadline", formData.deadline);
      // The name 'tenderDocument' must match the Multer configuration in tenders_route.js
      tenderData.append("tenderDocument", formData.tenderFile);

      console.log("Submitting tender...");

      // Make API call to your Express backend
      const response = await fetch('http://localhost:5000/tenders', {
        method: 'POST',
        body: tenderData,
      });

      // Get the response text to parse error messages
      const responseText = await response.text();
      console.log("Server response:", responseText);
      
      if (!response.ok) {
        let errorMessage = "Something went wrong. Please try again.";
        
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.msg || errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use the text directly
          errorMessage = responseText || errorMessage;
        }
        
        // Convert technical error to user-friendly message
        setError(getUserFriendlyError(errorMessage));
        return;
      }

      const result = JSON.parse(responseText);
      console.log("Tender created successfully:", result);
      
      setSuccess("Great! Your tender has been created successfully.");
      
      // Reset form after successful submission
      setFormData({
        title: "",
        deadline: "",
        tenderFile: null,
      });

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error) {
      console.error("Error creating tender:", error);
      
      // Handle different types of errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError("Cannot connect to the server. Please check your internet connection and try again.");
      } else {
        setError(getUserFriendlyError(error.message));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      deadline: "",
      tenderFile: null,
    });
    setError("");
    setSuccess("");
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="admin-form-container">
      <h1 className="admin-title">Create New Tender</h1>

      {/* Display error messages in simple, friendly language */}
      {error && (
        <div className="alert alert-error" style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          ⚠️ {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success" style={{
          backgroundColor: '#dcfce7',
          border: '1px solid #bbf7d0',
          color: '#166534',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          ✅ {success}
        </div>
      )}

      <form className="tender-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Tender Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter tender title (at least 3 characters)"
            required
            disabled={isLoading}
            minLength={3}
          />
          <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
            Must be at least 3 characters long
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="deadline">Deadline *</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            disabled={isLoading}
            min={new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]} // Tomorrow's date
          />
          <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
            Must be a future date
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="tenderFile">Tender Document *</label>
          <input
            type="file"
            id="tenderFile"
            name="tenderFile"
            ref={fileInputRef} // Attach the ref to the file input
            onChange={handleChange}
            accept=".pdf,.jpeg,.jpg,.png"
            required
            disabled={isLoading}
          />
          <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
            Only PDF, JPEG, JPG, or PNG files. Maximum size: 10MB
          </small>
          {formData.tenderFile && (
            <div style={{ 
              marginTop: '8px', 
              padding: '8px', 
              backgroundColor: '#f0f9ff', 
              borderRadius: '4px',
              fontSize: '13px',
              color: '#0369a1',
              border: '1px solid #e0f2fe'
            }}>
              📄 Selected: {formData.tenderFile.name} ({(formData.tenderFile.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>

        <div className="form-actions">
          <Button
            text="Clear Form"
            onClick={handleReset}
            variant="secondary"
            type="button"
            disabled={isLoading}
          />
          <Button
            text={isLoading ? "Creating Tender..." : "Create Tender"}
            onClick={handleSubmit}
            variant="primary"
            type="submit"
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
}

export default AdminTenderForm;