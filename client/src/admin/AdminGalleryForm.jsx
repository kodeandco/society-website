import React, { useState, useEffect, useRef } from "react";
import Button from "../components/Button";
import "./AdminGalleryForm.css";

// This is the main form component for creating and managing gallery items.
function AdminGalleryForm() {
  const [formData, setFormData] = useState({
    image: "",
    category: "",
    imageFile: null,
  });
  
  const [galleryItems, setGalleryItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const fileInputRef = useRef(null);

  // Predefined categories for the dropdown
  const categories = [
    "Architecture",
    "Landscape",
    "Interior",
    "Portrait",
    "Events",
    "Products",
    "Abstract",
    "Nature",
    "Other"
  ];

  // --- Fetch Gallery Items on Load ---
  const fetchGalleryItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://society-website-cpd3.onrender.com/photogallery');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGalleryItems(data);
    } catch (err) {
      console.error("Failed to fetch gallery items:", err);
      setError("Failed to load gallery items. Please check your network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // --- Form Handling ---

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setError("");
    setSuccess("");
    if (name === "imageFile") {
      setFormData({
        ...formData,
        imageFile: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Resets the form and clears any success/error messages.
  const handleReset = () => {
    setFormData({
      image: "",
      category: "",
      imageFile: null,
    });
    setEditingItemId(null);
    setError("");
    setSuccess("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handles form submission for both creating and editing gallery items.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!formData.imageFile) {
        setError("Please upload an image file.");
        setIsLoading(false);
        return;
    }

    try {
        const reader = new FileReader();
        reader.onloadend = async () => {
            let payload = {
                image: reader.result, // The Base64 string
                category: formData.category
            };

            let response;
            const headers = { 'Content-Type': 'application/json' };

            if (editingItemId) {
                response = await fetch(`https://society-website-cpd3.onrender.com/photogallery/${editingItemId}`, {
                    method: 'PUT',
                    headers: headers,
                    body: JSON.stringify(payload),
                });
            } else {
                response = await fetch('https://society-website-cpd3.onrender.com/photogallery', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "An unexpected error occurred.");
            }

            setSuccess(`Gallery item ${editingItemId ? 'updated' : 'created'} successfully!`);
            handleReset();
            fetchGalleryItems(); 
        };
        reader.readAsDataURL(formData.imageFile);
    } catch (err) {
        console.error("Submission error:", err);
        setError(`Failed to ${editingItemId ? 'update' : 'create'} gallery item. Please try again.`);
    } finally {
        setIsLoading(false);
    }
  };

  // --- Edit and Delete Handlers ---
  const handleEdit = (item) => {
    setEditingItemId(item._id);
    setFormData({
      image: item.image,
      category: item.category,
      imageFile: null,
    });
    setError("");
    setSuccess("");
  };

  const handleDelete = (itemId) => {
    setItemToDelete(itemId);
    setShowConfirmModal(true);
  };
  
  const confirmDelete = async () => {
    setShowConfirmModal(false);
    try {
      setIsLoading(true);
      const response = await fetch(`https://society-website-cpd3.onrender.com/photogallery/${itemToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete gallery item.");
      }

      setSuccess("Gallery item deleted successfully!");
      setItemToDelete(null);
      fetchGalleryItems(); 
    } catch (err) {
      console.error("Deletion error:", err);
      setError("Failed to delete gallery item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const groupedItems = galleryItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="admin-form-container">
      <h1 className="admin-title">{editingItemId ? 'Edit Gallery Item' : 'Add New Gallery Item'}</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="gallery-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="imageFile">Upload Image File</label>
          <input
            type="file"
            id="imageFile"
            name="imageFile" 
            accept="image/*"
            onChange={handleChange}
            disabled={isLoading}
            ref={fileInputRef}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            disabled={isLoading}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <Button
            text="Cancel/Reset"
            onClick={handleReset}
            variant="secondary"
            type="button"
            disabled={isLoading}
          />
          <Button
            text={isLoading ? "Submitting..." : (editingItemId ? 'Update Item' : 'Add to Gallery')}
            variant="primary"
            type="submit"
            disabled={isLoading}
          />
        </div>
      </form>
      
      <div className="gallery-list">
        <h2 className="gallery-list-title">Gallery Items ({galleryItems.length})</h2>
        {isLoading ? (
          <p>Loading gallery items...</p>
        ) : galleryItems.length === 0 ? (
          <p className="empty-state">No gallery items found. Add your first item above!</p>
        ) : (
          Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="category-section">
              <h3 className="category-title">{category} ({items.length})</h3>
              <div className="gallery-grid">
                {items.map((item) => (
                  <div key={item._id} className="gallery-card">
                    <div className="gallery-image-container">
                      <img 
                        src={item.image} 
                        alt={`Gallery item in ${item.category}`}
                        className="gallery-thumbnail"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                        }}
                      />
                    </div>
                    <div className="gallery-card-content">
                      <p className="gallery-meta">Added: {new Date(item.createdAt).toLocaleDateString()}</p>
                      <div className="gallery-actions">
                        <Button 
                          text="Edit"
                          onClick={() => handleEdit(item)} 
                          variant="secondary"
                          disabled={isLoading}
                        />
                        <Button 
                          text="Delete"
                          onClick={() => handleDelete(item._id)} 
                          variant="danger"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this gallery item?</p>
            <div className="modal-actions">
              <Button
                text="Cancel"
                onClick={() => setShowConfirmModal(false)}
                variant="secondary"
              />
              <Button
                text="Delete"
                onClick={confirmDelete}
                variant="danger"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminGalleryForm;
