import React from 'react';
import './GalleryCard.css';

function GalleryCard({ image, index }) {
  return (
    <div className="gallery-card-item">
      <div className="gallery-header">
        <span className="gallery-number">#{index + 1}</span>
        <h3 className="gallery-title">{image.title}</h3>
      </div>
      
      <div className="gallery-image-container">
        <img 
          src={image.image} 
          className="gallery-image"
          loading="lazy"
        />
      </div>
      
      <div className="gallery-info">
        <div className="image-details">
          <span className="detail-label">Category:</span>
          <span className="detail-value">{image.category || 'General'}</span>
        </div>
        
      </div>
      
    
    </div>
  );
}

export default GalleryCard;