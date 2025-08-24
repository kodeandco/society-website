import React from 'react';
import Button from '../components/Button';
import './Contact.css';

export default function Contact() {
  const handlePhoneClick = (phone) => {
    window.open(`tel:${phone}`, '_blank');
  };

  const contacts = [
    {
      position: "President",
      name: "Dr. SEN",
      phone: "7977898078"
    },
    {
      position: "Vice President",
      name: "Sarah Johnson",
      phone: "+91 98765 43210"
    },
    {
      position: "Secretary",
      name: "Mike Davis",
      phone: "+91 98765 43211"
    },
    {
      position: "Treasurer",
      name: "Emily Chen",
      phone: "+91 98765 43212"
    },
    {
      position: "Events Coordinator",
      name: "Alex Rodriguez",
      phone: "+91 98765 43213"
    }
  ];

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Get in touch with our society leadership team</p>
      </div>

      <div className="general-contact">
        <h2>General Information</h2>
        <div className="general-info">
          <p><strong>Society Email:</strong> kv2k.bom2@gmail.com</p>
          <p><strong>Main Office:</strong> +91 98765 43200</p>
          <p><strong>Address:</strong> 123 Society Street, City, State 12345</p>
        </div>
      </div>

      <div className="contacts-grid">
        <h2>Leadership Team</h2>
        <div className="contacts-list">
          {contacts.map((contact, index) => (
            <div key={index} className="contact-card">
              <div className="contact-info">
                <h3>{contact.position}</h3>
                <h4>{contact.name}</h4>
                <p className="contact-detail">
                  <span className="contact-icon">📞</span>
                  {contact.phone}
                </p>
              </div>
              <div className="contact-actions">
                <Button 
                  text="Call" 
                  onClick={() => handlePhoneClick(contact.phone)}
                  variant="primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="contact-footer">
        <h3>Office Hours</h3>
        <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
        <p>Saturday: 10:00 AM - 2:00 PM</p>
        <p>Sunday: Closed</p>
      </div>
    </div>
  );
}