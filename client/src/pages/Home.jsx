import React from "react";
import Announce from "../components/Announce";
import Infra from "../components/Infra";
import Gallery from "../components/Gallery";
import Map from "../components/Map";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      {/* === Hero Section === */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Kendriya Vihar Phase - 2</h1>
          <p>Modern living, green spaces, and a vibrant community in Kolkata.</p>
          <a href="/about" className="hero-btn">Explore More</a>
        </div>
      </section>

      {/* === Announcement Section === */}
      <section className="section-wrapper">
        <h2 className="section-title">Latest Announcements</h2>
        <Announce />
      </section>

      {/* === Infrastructure / Features Section === */}
      <section className="section-wrapper">
        <h2 className="section-title">Our Infrastructure</h2>
        <Infra />
      </section>

      {/* === Gallery Preview Section === */}
      <section className="section-wrapper">
        <h2 className="section-title">Community Gallery</h2>
        <Gallery preview={true} />
        <div className="view-more">
          <a href="/gallery" className="view-btn">View Full Gallery</a>
        </div>
      </section>

      {/* === Map Section === */}
      <section className="section-wrapper">
        <h2 className="section-title">Find Us</h2>
        <Map />
      </section>
    </div>
  );
}

export default Home;
