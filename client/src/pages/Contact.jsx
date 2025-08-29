// Contact.jsx
import React, { useState } from "react";
import "./Contact.css";

export default function Contact() {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // === Board Members ===
  const boardMembers = [
    { slNo: 1, name: "DR. DEEPAK SEN", designation: "President" },
    { slNo: 2, name: "SHRI BUDDHADEB DAS", designation: "Vice-President" },
    { slNo: 3, name: "SHRI ACHINTYA KUMAR HAZRA", designation: "Manager" },
    { slNo: 4, name: "SHRI TUHIN KUMAR PAL", designation: "Secretary" },
    { slNo: 5, name: "SHRI SOUMOK BASU", designation: "Manager" },
    { slNo: 6, name: "DR. NARAYAN MOITRA", designation: "Treasurer" },
    { slNo: 7, name: "SHRI SAMIR KUMAR MAJI", designation: "Asst. Treasurer" },
    { slNo: 8, name: "MRS. SEEMA SAHA", designation: "Asst. Treasurer" },
    { slNo: 9, name: "SHRI GOUTAM MUKHERJEE", designation: "Manager" },
    { slNo: 10, name: "SHRI BIVAS MANDAL", designation: "Manager" },
    { slNo: 11, name: "SHRI DEBABRATA CHANDA", designation: "Manager" },
    { slNo: 12, name: "SHRI SHYAMAL NASKAR", designation: "Manager" },
    { slNo: 13, name: "SHRI MADHUSUDAN MAJUMDAR", designation: "Manager" },
    { slNo: 14, name: "SHRI CHANDAN BOSE", designation: "Manager" },
    { slNo: 15, name: "SHRI JAYANTA KUMAR DAS", designation: "Manager" },
    { slNo: 16, name: "SHRI SANDIP MITRA", designation: "Manager" },
    { slNo: 17, name: "SHRI SANJEEV CHOWDHURY", designation: "Manager" },
    { slNo: 18, name: "SHRI DEEPAK TUSHAR BANERJEE", designation: "Manager" },
    { slNo: 19, name: "SHRI ASIT KUMAR DE", designation: "Manager" },
    { slNo: 20, name: "SHRI BAPPA BHATTACHARYA", designation: "Manager" },
    { slNo: 21, name: "SHRI PRANAB KUMAR MISHRA", designation: "Manager" },
    { slNo: 22, name: "SHRI DIPAK KUMAR SENGUPTA", designation: "Manager" },
    { slNo: 23, name: "SHRI NITIN NISHANT", designation: "Manager" },
    { slNo: 24, name: "SHRI SHAILESH KUMAR MALLICK", designation: "Manager" },
    { slNo: 25, name: "SHRI SUBRATA BHOWMICK", designation: "Manager" },
    { slNo: 26, name: "SHRI NARAYAN CHANDRA GHOSH", designation: "Manager" },
    { slNo: 27, name: "SHRI ANIL KUMAR RAI", designation: "Manager" },
    { slNo: 28, name: "SHRI SAUBHIK PAN", designation: "Manager" },
    { slNo: 29, name: "SHRI BISWANATH NAYAK", designation: "Manager" },
    { slNo: 30, name: "DR. MD. HAROON RASHID", designation: "Manager" },
    { slNo: 31, name: "SHRI AHI BHUSHAN CHAKRAVIRTY", designation: "Manager" },
  ];

  // === Committees ===
  const committees = [
    {
      id: "tender",
      title: "Tender / Procurement Committee",
      chairman: "Shri Jayanta Kumar Das",
      members: [
        { slNo: 1, name: "Shri Tuhin Kumar Pal" },
        { slNo: 2, name: "Shri Ahi Bhushan Chakravorty" },
        { slNo: 3, name: "Shri Subrata Bhowmick" },
        { slNo: 4, name: "Shri Pranab Mishra" },
      ],
      coopted: [
        { slNo: 1, name: "Shri Shyamal Mukherjee" },
        { slNo: 2, name: "Shri Asit De" },
        { slNo: 3, name: "Shri Saroj Mistry" },
      ],
    },
    {
      id: "renovation",
      title: "Building Renovation & Painting Committee",
      chairman: "Dr. Narayan Chandra Ghosh",
      members: [
        { slNo: 1, name: "Shri Asit De (Technical Head)" },
        { slNo: 2, name: "Shri Subrata Bhowmick" },
        { slNo: 3, name: "Shri Sailesh Mallick" },
      ],
      coopted: [
        { slNo: 1, name: "Shri Ashish Das" },
        { slNo: 2, name: "Shri Joydev Roy" },
        { slNo: 3, name: "Shri Rajesh Sit" },
        { slNo: 4, name: "Shri Saral Sarkar" },
      ],
      staff: [
        { slNo: 1, name: "Shri Atanu Ganguly", role: "Civil Engineer" },
        { slNo: 2, name: "Shri Prabir Patra", role: "Supervisor" },
      ],
    },
    {
      id: "watertreatment",
      title: "Water Treatment Plant Committee",
      chairman: "Dr. Narayan Chandra Ghosh",
      members: [
        { slNo: 1, name: "Shri Asit De" },
        { slNo: 2, name: "Shri Saubhik Pan" },
        { slNo: 3, name: "Shri Subrata Bhowmick" },
        { slNo: 4, name: "Shri Sailesh Mallick" },
      ],
      coopted: [
        { slNo: 1, name: "Dr. Gouranga Kar" },
        { slNo: 2, name: "Shri Ratan Ch. Paul" },
        { slNo: 3, name: "Shri Pranab Bhattacharya" },
        { slNo: 4, name: "Shri Subrata Saha" },
        { slNo: 5, name: "Shri Biswapriya Majumdar" },
      ],
      staff: [
        { slNo: 1, name: "Shri Atanu Ganguly", role: "Site Engineer" },
        { slNo: 2, name: "Shri Prabir Patra", role: "Supervisor" },
      ],
    },
    {
      id: "grievance",
      title: "Grievance Redressal Committee",
      members: [
        { slNo: 1, name: "Rtd. JUSTICE T.C. Roy Bhowmick" },
        { slNo: 2, name: "Advocate Malabika Saha" },
        { slNo: 3, name: "Dr. T.P. Bagchi" },
        { slNo: 4, name: "Dr. Amit Kumar Sen" },
        { slNo: 5, name: "Smt. Rachyita Sammaddar" },
      ],
    },
    {
      id: "monitoring",
      title: "Monitoring Committee",
      members: [
        { slNo: 1, name: "Smt. Seema Saha" },
        { slNo: 2, name: "Dr. Syamal Naskar" },
        { slNo: 3, name: "Shri Subrata Bhowmick" },
        { slNo: 4, name: "Shri Pranab Mishra" },
        { slNo: 5, name: "Shri Biswanath Nayak" },
        { slNo: 6, name: "Dr. Haradhan Sarkar" },
      ],
    },
    {
      id: "digital",
      title: "Digital Communications Committee",
      members: [
        { slNo: 1, name: "Shri Jayanta Kumar Das" },
        { slNo: 2, name: "Shri Soumok Basu" },
      ],
    },
    {
      id: "advisory",
      title: "Advisory Committee",
      members: [
        { slNo: 1, name: "Shri K.K. Gangopadhyaya" },
        { slNo: 2, name: "Dr. Haradhan Sarkar" },
        { slNo: 3, name: "Dr. Gouranga Kar" },
        { slNo: 4, name: "Shri Birmalendu Saha" },
        { slNo: 5, name: "Shri Pradyut Mishra" },
      ],
    },
    {
      id: "waterbody",
      title: "Waterbody & Landscaping Committee",
      members: [
        { slNo: 1, name: "Dr. Syamal Naskar" },
        { slNo: 2, name: "Shri Pranab Mishra" },
        { slNo: 3, name: "Dr. Haradhan Sarkar" },
        { slNo: 4, name: "Shri Subrata Bhowmick" },
        { slNo: 5, name: "Shri Raghu Nandan Biswas" },
        { slNo: 6, name: "Shri Utpal Saha" },
        { slNo: 7, name: "Apko Chatterjee" },
      ],
    },
  ];

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
        <h2 className="section-title">Committees & Management Structure</h2>

        {/* Board Members */}
        <div className="committee-card">
          <button
            onClick={() => toggleSection("board")}
            className="committee-header"
          >
            <div className="committee-header-content">
              <div className="committee-info">
                <h3 className="committee-title">Board Members</h3>
                <p className="committee-chairman">Executive Board of KV Phase-2</p>
              </div>
              <div className={`toggle-icon ${openSections["board"] ? "open" : ""}`}>
                {openSections["board"] ? "−" : "+"}
              </div>
            </div>
          </button>

          {openSections["board"] && (
            <div className="committee-content">
              <div className="members-section">
                <h4 className="section-heading">Board Members</h4>
                <div className="members-grid">
                  {boardMembers.map((member) => (
                    <div key={member.slNo} className="member-card">
                      <div className="member-sl">{member.slNo}.</div>
                      <div className="member-name">{member.name}</div>
                      <div className="member-role">{member.designation}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Committees */}
        <div className="committees-container">
          {committees.map((committee) => {
            const isOpen = openSections[committee.id];
            return (
              <div key={committee.id} className="committee-card">
                <button
                  onClick={() => toggleSection(committee.id)}
                  className="committee-header"
                >
                  <div className="committee-header-content">
                    <div className="committee-info">
                      <h3 className="committee-title">{committee.title}</h3>
                      {committee.chairman && (
                        <p className="committee-chairman">
                          Chairman: {committee.chairman}
                        </p>
                      )}
                    </div>
                    <div className={`toggle-icon ${isOpen ? "open" : ""}`}>
                      {isOpen ? "−" : "+"}
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="committee-content">
                    {committee.chairman && (
                      <div className="chairman-section">
                        <h4 className="section-heading">Chairman</h4>
                        <div className="chairman-card">{committee.chairman}</div>
                      </div>
                    )}

                    {committee.members && (
                      <div className="members-section">
                        <h4 className="section-heading">Members</h4>
                        <div className="members-grid">
                          {committee.members.map((member) => (
                            <div key={member.slNo} className="member-card">
                              <div className="member-sl">{member.slNo}.</div>
                              <div className="member-name">{member.name}</div>
                              {member.role && (
                                <div className="member-role">{member.role}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {committee.coopted && (
                      <div className="members-section">
                        <h4 className="section-heading">Co-Opted Members</h4>
                        <div className="members-grid">
                          {committee.coopted.map((member) => (
                            <div key={member.slNo} className="member-card">
                              <div className="member-sl">{member.slNo}.</div>
                              <div className="member-name">{member.name}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {committee.staff && (
                      <div className="members-section">
                        <h4 className="section-heading">Staff</h4>
                        <div className="members-grid">
                          {committee.staff.map((staff) => (
                            <div key={staff.slNo} className="member-card">
                              <div className="member-sl">{staff.slNo}.</div>
                              <div className="member-name">{staff.name}</div>
                              <div className="member-role">{staff.role}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
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
