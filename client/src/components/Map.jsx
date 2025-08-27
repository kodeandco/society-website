function Map() {
  const handleGetDirections = () => {
    const coordinates = "22.639170,88.435368";
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates}&travelmode=driving`;
    window.open(directionsUrl, '_blank');
  };

  const buttonStyle = {
    background: '#4285f4',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
    maxWidth: '200px',
    marginTop: '10px'
  };

  return (
    <section className="card location-map">
      <h2>Location</h2>
      <div className="map-responsive">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.8!2d88.435368!3d22.639170!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM4JzIxLjAiTiA4OMKwMjYnMDcuMyJF!5e0!3m2!1sen!2sin!4v1686234567890!5m2!1sen!2sin"
          width="100%"
          height="250"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="KV2K Location Map"
        />
      </div>
      <button 
        onClick={handleGetDirections} 
        style={buttonStyle}
        onMouseOver={(e) => e.target.style.background = '#3367d6'}
        onMouseOut={(e) => e.target.style.background = '#4285f4'}
      >
        Get Directions
      </button>
    </section>
  );
}

export default Map;