import React, { useState } from 'react';
import './GalleryCard.css';

function GalleryCard({ image, index }) {
  const [showLightbox, setShowLightbox] = useState(false);

  const handleImageClick = (e) => {
    e.stopPropagation();
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  return (
    <>
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
            alt={image.title}
            onClick={handleImageClick}
          />
        </div>
        
        <div className="gallery-info">
          <div className="image-details">
            <span className="detail-label">Category:</span>
            <span className="detail-value">{image.category || 'General'}</span>
          </div>
        </div>
      </div>

      {/* Lightbox for big image */}
      {showLightbox && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content">
            <button className="close-btn" onClick={closeLightbox}>×</button>
            <img 
              src={image.image} 
              alt={image.title}
              className="lightbox-image"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default GalleryCard;