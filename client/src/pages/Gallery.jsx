import React, { useState, useEffect } from 'react';
import Gallery from '../components/GalleryComponent';
import './Gallery.css';

function GalleryPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/gallery/categories');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load gallery categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="gallery-page">
        <div className="page-header">
          <h1 className="page-title">Photo Gallery</h1>
          <p className="page-subtitle">Loading gallery categories...</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-page">
        <div className="page-header">
          <h1 className="page-title">Photo Gallery</h1>
          <p className="page-subtitle error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <div className="page-header">
        <h1 className="page-title">Photo Gallery</h1>
        <p className="page-subtitle">
          Capturing moments and memories from our celebrations
        </p>
        {categories.length > 0 && (
          <p className="gallery-stats">
            {categories.length} categories • {categories.reduce((total, cat) => total + cat.count, 0)} photos
          </p>
        )}
      </div>
      
      <div className="gallery-sections">
        {categories.length === 0 ? (
          <div className="empty-gallery">
            <p>No gallery categories found. Start by adding some photos!</p>
          </div>
        ) : (
          categories.map((categoryData) => (
            <Gallery 
              key={categoryData.category}
              title={categoryData.category}
              category={categoryData.category}
              photoCount={categoryData.count}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default GalleryPage;