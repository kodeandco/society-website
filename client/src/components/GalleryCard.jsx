import React, { useState } from 'react';
import './GalleryCard.css';

function GalleryCard({ image }) {
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
        {/* Image */}
        <div className="gallery-image-container" onClick={handleImageClick}>
          <img 
            src={image.image}
            className="gallery-image"
            loading="lazy"
            alt={image.title}
          />
        </div>
        
        {/* Info below image */}
        <div className="gallery-info">
          <h3 className="gallery-title">{image.title}</h3>
          <div className="image-details">
            <span className="detail-label">Category:</span>
            <span className="detail-value">{image.category || 'General'}</span>
          </div>
        </div>
      </div>

      {/* Lightbox for big image */}
      {showLightbox && (
        <div className="lightbox" onClick={closeLightbox}>
          <div 
            className="lightbox-content" 
            onClick={(e) => e.stopPropagation()} // stops closing when clicking inside
          >
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
