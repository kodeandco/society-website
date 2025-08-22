import React, { useState, useEffect } from 'react';
import './GalleryComponent.css';

function GalleryComponent({ title, category, photoCount = 0 }) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Number of images to show initially
  const INITIAL_DISPLAY_COUNT = 6;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch images for this specific category
        const response = await fetch(`http://localhost:5000/gallery?category=${encodeURIComponent(category)}`);
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
  }, [category]);

  // Determine which images to display
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
          <div key={image._id || index} className="gallery-item">
            <img
              src={image.url}
              alt={`${title} - Photo ${index + 1}`}
              className="gallery-image"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIFVuYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
                e.target.classList.add('error');
              }}
            />
            <div className="gallery-overlay">
              <p className="image-date">
                {new Date(image.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
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

export default GalleryComponent;