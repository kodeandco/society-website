import React from "react";
import Announce from "../components/Announce";
import Infra from "../components/Infra";
import Gallery from "../components/Gallery";
import Map from "../components/Map";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      {/* === Hero Section with Head Image === */}
      <section className="hero-section">
        <div className="hero-bg"></div>
        <div className="hero-overlay">
          <h1>Welcome to Kendriya Vihar Phase - 2</h1>
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