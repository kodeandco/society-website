function Map() {
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
        ></iframe>
      </div>
    </section>
  );
}

export default Map;