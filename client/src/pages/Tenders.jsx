import React, { useState, useEffect } from 'react';
import './Tenders.css';
import TenderCard from './TenderCard';

function Tenders() {
  const [tenders, setTenders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Function to format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to convert database tender to TenderCard format
  const formatTenderForCard = (dbTender) => {
    return {
      id: dbTender._id,
      title: dbTender.title,
      posted: formatDate(dbTender.uploadDate || dbTender.createdAt),
      deadline: formatDate(dbTender.deadline),
      download: `/tenders/download/${dbTender._id}`, // Download URL
      status: dbTender.status,
      fileName: dbTender.fileName,
      isExpired: new Date(dbTender.deadline) < new Date()
    };
  };

  // Fetch tenders from database
  const fetchTenders = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch('http://localhost:5000/tenders');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const tendersData = await response.json();
      
      // Transform database data to match TenderCard expected format
      const formattedTenders = tendersData.map(formatTenderForCard);
      
      setTenders(formattedTenders);
      console.log("Tenders loaded:", formattedTenders);
      
    } catch (error) {
      console.error("Error fetching tenders:", error);
      
      // User-friendly error messages
      if (error.message.includes('fetch')) {
        setError("Cannot connect to the server. Please check your internet connection.");
      } else if (error.message.includes('500')) {
        setError("Server is having issues. Please try again in a few minutes.");
      } else {
        setError("Unable to load tenders. Please refresh the page.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load tenders when component mounts
  useEffect(() => {
    fetchTenders();
  }, []);

  // Function to refresh tenders (useful for real-time updates)
  const handleRefresh = () => {
    fetchTenders();
  };

  if (isLoading) {
    return (
      <div className="tenders-container">
        <h1 className="tenders-title">Tenders</h1>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          fontSize: '16px'
        }}>
          <div style={{ marginBottom: '10px' }}>⏳</div>
          Loading tenders...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tenders-container">
        <h1 className="tenders-title">Tenders</h1>
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '16px',
          borderRadius: '8px',
          margin: '20px 0',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '10px', fontSize: '20px' }}>❌</div>
          <div style={{ fontWeight: '500', marginBottom: '8px' }}>
            {error}
          </div>
          <button 
            onClick={handleRefresh}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tenders-container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 className="tenders-title">Tenders</h1>
        <button 
          onClick={handleRefresh}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          disabled={isLoading}
        >
          🔄 Refresh
        </button>
      </div>

      {tenders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ marginBottom: '10px', fontSize: '24px' }}>📋</div>
          <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
            No tenders available
          </div>
          <div style={{ fontSize: '14px' }}>
            New tenders will appear here once they are created.
          </div>
        </div>
      ) : (
        <>
          <div style={{
            marginBottom: '16px',
            color: '#666',
            fontSize: '14px'
          }}>
            Showing {tenders.length} tender{tenders.length !== 1 ? 's' : ''}
          </div>
          <div className="tenders-vertical-list">
            {tenders.map((tender, index) => (
              <TenderCard key={tender.id || index} tender={tender} index={index} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Tenders;