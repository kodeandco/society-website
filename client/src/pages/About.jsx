import React from "react";
import "./About.css";

const About = () => {
  return (
    <section className="about">
      <div className="about-container">
        <h1 className="about-title">About Kendriya Vihar Phase – 2</h1>
        <p className="about-intro">
          Kendriya Vihar Phase – 2 is a residential complex developed by{" "}
          <span className="highlight">CGEWHO</span>, spread across{" "}
          <span className="highlight">10 acres</span> in Birati, Kolkata. The
          project offers prime location, comfortable & lavish lifestyle, modern
          amenities, healthy surroundings, and high returns.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <h2>Project Overview</h2>
            <p>
              Spread over <b>10 acres</b> with <b>582 dwelling units</b>, the
              complex features <b>20 towers</b> with <b>7 floors</b> each. Each
              apartment is designed to maximize space and ensure proper
              ventilation with wide windows for natural light.
            </p>
          </div>

          <div className="about-card">
            <h2>Apartment Options</h2>
            <p>
              The project offers spacious <b>1BHK, 2BHK, 3BHK,</b> and{" "}
              <b>4BHK apartments</b>, crafted with designer tiled flooring,
              granite kitchen counters, and modern sanitary fittings.
            </p>
          </div>

          <div className="about-card">
            <h2>Amenities & Lifestyle</h2>
            <p>
              Equipped with all the essential amenities, Kendriya Vihar Phase–2
              ensures a comfortable lifestyle with a perfect blend of elegance,
              convenience, and modernity for all residents.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
