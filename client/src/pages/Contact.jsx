import React from 'react';
import Button from '../components/Button';
import './Contact.css';

export default function Contact() {
  const handlePhoneClick = (phone) => {
    if (phone) {
      window.open(`tel:${phone}`, '_blank');
    }
  };

  const boardMembers = [
    {
      slNo: 1,
      name: "DR. DEEPAK SEN",
      designation: "President",
      mobile: "9445297340"
    },
    {
      slNo: 2,
      name: "SHRI BUDDHADEB DAS",
      designation: "Vice-President",
      mobile: "9434027817"
    },
    {
      slNo: 3,
      name: "SHRI ACHINTYA KUMAR HAZRA",
      designation: "Manager",
      mobile: "7022368891"
    },
    {
      slNo: 4,
      name: "SHRI TUHIN KUMAR PAL",
      designation: "Secretary",
      mobile: "9830453563"
    },
    {
      slNo: 5,
      name: "SHRI SOUMOK BASU",
      designation: "Manager",
      mobile: "8777846760"
    },
    {
      slNo: 6,
      name: "DR. NARAYAN MOITRA",
      designation: "Treasurer",
      mobile: "9431509908"
    },
    {
      slNo: 7,
      name: "SHRI SAMIR KUMAR MAJI",
      designation: "Asst. Treasurer",
      mobile: "9433912082"
    },
    {
      slNo: 8,
      name: "MRS. SEEMA SAHA",
      designation: "Asst. Treasurer",
      mobile: "9432669431"
    },
    {
      slNo: 9,
      name: "SHRI GOUTAM MUKHERJEE",
      designation: "Manager",
      mobile: "9830023972"
    },
    {
      slNo: 10,
      name: "SHRI BIVAS MANDAL",
      designation: "Manager",
      mobile: "9969573382"
    },
    {
      slNo: 11,
      name: "SHRI DEBABRATA CHANDA",
      designation: "Manager",
      mobile: "9413354512"
    },
    {
      slNo: 12,
      name: "SHRI SHYAMAL NASKAR",
      designation: "Manager",
      mobile: "9432011943"
    },
    {
      slNo: 13,
      name: "SHRI MADHUSUDAN MAJUMDAR",
      designation: "Manager",
      mobile: "9869650162"
    },
    {
      slNo: 14,
      name: "SHRI CHANDAN BOSE",
      designation: "Manager",
      mobile: "8552000201"
    },
    {
      slNo: 15,
      name: "SHRI JAYANTA KUMAR DAS",
      designation: "Manager",
      mobile: "9423490071"
    },
    {
      slNo: 16,
      name: "SHRI SANDIP MITRA",
      designation: "Manager",
      mobile: "9821659961"
    },
    {
      slNo: 17,
      name: "SHRI SANJEEV CHOWDHURY",
      designation: "Manager",
      mobile: "9850077050"
    },
    {
      slNo: 18,
      name: "SHRI DEEPAK TUSHAR BANERJEE",
      designation: "Manager",
      mobile: "9999057502"
    },
    {
      slNo: 19,
      name: "SHRI ASIT KUMAR DE",
      designation: "Manager",
      mobile: "8007991574"
    },
    {
      slNo: 20,
      name: "SHRI BAPPA BHATTACHARYA",
      designation: "Manager",
      mobile: "7042802662"
    },
    {
      slNo: 21,
      name: "SHRI PRANAB KUMAR MISHRA",
      designation: "Manager",
      mobile: "9531620635"
    },
    {
      slNo: 22,
      name: "SHRI DIPAK KUMAR SENGUPTA",
      designation: "Manager",
      mobile: "8240562198"
    },
    {
      slNo: 23,
      name: "SHRI NITIN NISHANT",
      designation: "Manager",
      mobile: "9748721320"
    },
    {
      slNo: 24,
      name: "SHRI SHAILESH KUMAR MALLICK",
      designation: "Manager",
      mobile: "8240272844"
    },
    {
      slNo: 25,
      name: "SHRI SUBRATA BHOWMICK",
      designation: "Manager",
      mobile: "9477093257"
    },
    {
      slNo: 26,
      name: "SHRI NARAYAN CHANDRA GHOSH",
      designation: "Manager",
      mobile: "9997711959"
    },
    {
      slNo: 27,
      name: "SHRI ANIL KUMAR RAI",
      designation: "Manager",
      mobile: ""
    },
    {
      slNo: 28,
      name: "SHRI SAUBHIK PAN",
      designation: "Manager",
      mobile: "8910085793"
    },
    {
      slNo: 29,
      name: "SHRI BISWANATH NAYAK",
      designation: "Manager",
      mobile: "9007004187"
    },
    {
      slNo: 30,
      name: "DR. MD. HAROON RASHID",
      designation: "Manager",
      mobile: "9433530994"
    },
    {
      slNo: 31,
      name: "SHRI AHI BHUSHAN CHAKRAVIRTY",
      designation: "Manager",
      mobile: "9897242007"
    }
  ];

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Get in touch with our Board of Managers</p>
      </div>

      <div className="general-contact">
        <h2>General Information</h2>
        <div className="general-info">
          <p><strong>Society Email:</strong> office.kv2k@gmail.com</p>
          <p><strong>Address:</strong> Kendriya Vihar Phase - 2, Kolkata</p>
        </div>
      </div>

      <div className="contacts-grid">
        <h2>Board of Managers</h2>
        <div className="contacts-list">
          {boardMembers.map((member, index) => (
            <div key={index} className="contact-card">
              <div className="contact-info">
                <div className="contact-header-info">
                  <span className="designation-badge">{member.designation}</span>
                </div>
                <h3>{member.name}</h3>
                {member.mobile && (
                  <p className="contact-detail">
                    <span className="contact-icon">📞</span>
                    {member.mobile}
                  </p>
                )}
              </div>
              <div className="contact-actions">
                {member.mobile ? (
                  <Button
                    text="Call"
                    onClick={() => handlePhoneClick(member.mobile)}
                    variant="primary"
                  />
                ) : (
                  <span className="no-contact">No mobile listed</span>
                )}
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