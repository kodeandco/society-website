import React from 'react';
import './TenderCard.css';
import Button from '../components/Button';

function TenderCard({ tender, index }) {
  const handleDownload = () => {
    if (tender.download === '#') {
      alert(`Downloading tender document for: ${tender.title}`);
    } else {
      window.open(tender.download, '_blank');
    }
  };

  return (
    <div className="tender-card-item">
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
