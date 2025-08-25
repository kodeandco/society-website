import React from 'react';
import './TenderCard.css';
import Button from '../components/Button';

function TenderCard({ tender, index }) {
  const handleDownload = async () => {
    try {
      // Show loading state by getting the button element
      const downloadButton = document.querySelector(`[data-tender-id="${tender.id}"] button`);
      if (downloadButton) {
        downloadButton.disabled = true;
        downloadButton.textContent = 'Downloading...';
      }

      // Make request to download endpoint
      const response = await fetch(`https://society-website-cpd3.onrender.com/tenders/download/${tender.id}`);
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      // Get the filename from response headers or use stored filename
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = tender.fileName || 'tender-document';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Convert response to blob
      const blob = await response.blob();
      
      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      
      // Append to body, click, and remove
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Download error:', error);
      alert(`Failed to download file: ${error.message}`);
    } finally {
      // Reset button state
      const downloadButton = document.querySelector(`[data-tender-id="${tender.id}"] button`);
      if (downloadButton) {
        downloadButton.disabled = false;
        downloadButton.textContent = 'Download Document';
      }
    }
  };

  return (
    <div className="tender-card-item" data-tender-id={tender.id}>
      <div className="tender-header">
        <span className="tender-number">#{index + 1}</span>
        <h3 className="tender-title">{tender.title}</h3>
      </div>
      
      <div className="tender-info">
        <div className="tender-date">
          <span className="date-label">Posted:</span>
          <span className="date-value">{tender.posted}</span>
        </div>
        <div className="tender-date">
          <span className="date-label">Deadline:</span>
          <span className="date-value">{tender.deadline}</span>
        </div>
      </div>
      
      <div className="tender-action">
        <Button 
          text="Download Document"
          onClick={handleDownload}
          variant="primary"
        />
    
      </div>
    </div>
  );
}

export default TenderCard;