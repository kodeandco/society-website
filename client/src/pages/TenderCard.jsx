import React, { useState } from 'react';
import './TenderCard.css';
import Button from '../components/Button';

function TenderCard({ tender, index }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  // Detect if user is on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Primary download method (works best on desktop and modern mobile browsers)
  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError('');

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
      
      // For mobile browsers, add additional attributes
      if (isMobile) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      
      // Append to body, click, and remove
      document.body.appendChild(a);
      a.click();
      
      // Cleanup with slight delay for mobile browsers
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

    } catch (error) {
      console.error('Download error:', error);
      setError(`Failed to download: ${error.message}`);
      
      // Fallback: try direct download method for mobile
      if (isMobile) {
        handleDirectDownload();
      }
    } finally {
      setDownloading(false);
    }
  };

  // Fallback method 1: Direct download (good for mobile)
  const handleDirectDownload = () => {
    const url = `https://society-website-cpd3.onrender.com/tenders/download/${tender.id}`;
    window.location.href = url;
  };

  // Fallback method 2: View in browser (best for mobile document viewing)
  const handleViewInBrowser = () => {
    const url = `https://society-website-cpd3.onrender.com/tenders/view/${tender.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Smart download that chooses best method based on device
  const handleSmartDownload = () => {
    if (isMobile) {
      // For mobile, try the blob method first, with fallbacks
      handleDownload();
    } else {
      // For desktop, use the original blob method
      handleDownload();
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
      
      {error && (
        <div className="error-message" style={{ 
          color: 'red', 
          fontSize: '0.9rem', 
          marginBottom: '10px',
          textAlign: 'center' 
        }}>
          {error}
        </div>
      )}
      
      <div className="tender-action">
        {/* Primary download button */}
        <Button 
          text={downloading ? "Downloading..." : "Download Document"}
          onClick={handleSmartDownload}
          variant="primary"
          disabled={downloading}
        />
        
        {/* Mobile-specific additional options */}
        {isMobile && (
          <div className="mobile-options" style={{ 
            marginTop: '8px', 
            display: 'flex', 
            gap: '8px',
            justifyContent: 'center'
          }}>
            <button 
              onClick={handleViewInBrowser}
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                border: '1px solid #ccc',
                backgroundColor: 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                color: '#666'
              }}
              disabled={downloading}
            >
              View in Browser
            </button>
            <button 
              onClick={handleDirectDownload}
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                border: '1px solid #ccc',
                backgroundColor: 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                color: '#666'
              }}
              disabled={downloading}
            >
              Direct Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TenderCard;