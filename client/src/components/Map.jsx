function Map() {
  return (
    <section className="card location-map">
      <h2>Location</h2>
      <div className="map-responsive">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.013370685996!2d88.4314733154326!3d22.6100779851671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275e2e2b2c2e1%3A0x7e2b2e2b2e2b2e2b!2sKendriya%20Vihar%20Phase%20II!5e0!3m2!1sen!2sin!4v1686234567890!5m2!1sen!2sin"
          width="100%"
          height="250"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Kendriya Vihar Phase 2 Map"
        ></iframe>
      </div>
    </section>
  );
}

export default Map;
