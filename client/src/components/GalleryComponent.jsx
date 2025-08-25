import React, { useState, useEffect } from 'react';
import GalleryCard from "./GalleryCard";
import './GalleryComponent.css';

// This component fetches and displays images for a specific category from the backend.
function Gallery({ title, category, photoCount = 0 }) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const INITIAL_DISPLAY_COUNT = 6;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Corrected URL to match the server.js file
        const response = await fetch(`https://society-website-cpd3.onrender.com/photogallery?category=${encodeURIComponent(category)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setImages(data);
      } catch (err) {
        console.error(`Failed to fetch images for ${category}:`, err);
        setError('Failed to load images for this category.');
      } finally {
        setIsLoading(false);
      }
    };

    if (category) {
      fetchImages();
    }
  }, [category]); // Rerun the fetch when the category prop changes

  const displayImages = showAll ? images : images.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMoreImages = images.length > INITIAL_DISPLAY_COUNT;

  if (isLoading) {
    return (
      <div className="gallery-section">
        <div className="gallery-header">
          <h2 className="gallery-title">{title}</h2>
          <p className="gallery-count">Loading...</p>
        </div>
        <div className="gallery-grid loading">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="gallery-item skeleton">
              <div className="skeleton-image"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-section">
        <div className="gallery-header">
          <h2 className="gallery-title">{title}</h2>
          <p className="gallery-count error">{error}</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="gallery-section">
        <div className="gallery-header">
          <h2 className="gallery-title">{title}</h2>
          <p className="gallery-count">No photos yet</p>
        </div>
        <div className="empty-category">
          <p>No photos available in this category.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-section">
      <div className="gallery-header">
        <h2 className="gallery-title">{title}</h2>
        <p className="gallery-count">
          {photoCount > 0 ? `${photoCount} photos` : `${images.length} photos`}
        </p>
      </div>
      
      <div className="gallery-grid">
        {displayImages.map((image, index) => (
          <GalleryCard
            key={image._id || index}
            image={image}
            index={index}
          />
        ))}
      </div>
      
      {hasMoreImages && (
        <div className="gallery-actions">
          <button
            className="view-more-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `View All ${images.length} Photos`}
          </button>
        </div>
      )}
    </div>
  );
}

export default Gallery;
