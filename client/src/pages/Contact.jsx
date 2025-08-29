// Contact.jsx
import React from "react";
import "./Contact.css";

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="header">
        <div className="header-container">
          <h1 className="header-title">Contact Us</h1>
          <p className="header-subtitle">
            Connect with Kendriya Vihar Phase - 2 Management Teams & Committees <br />
            <strong>Office Mail ID:</strong> office.kv2k@gmail.com | contact.kv2k@gmail.com <br />
            <strong>Landline:</strong> 033-46022981 <br />
            <strong>Mobile:</strong> +91 94771 12930
          </p>
        </div>
      </div>

      <div className="main-container">
        <div className="contact-info-card">
          <h2 className="section-title">Office Contact</h2>
          <ul className="contact-list">
            <li><strong>Email:</strong> office.kv2k@gmail.com</li>
            <li><strong>Email (Alt):</strong> contact.kv2k@gmail.com</li>
            <li><strong>Landline:</strong> 033-46022981</li>
            <li><strong>Mobile:</strong> +91 94771 12930</li>
          </ul>
        </div>

        <div className="footer">
          <p>
            For specific inquiries, please contact the relevant committee chairman
            or reach out through our office number.
          </p>
        </div>
      </div>
    </div>
  );
}
