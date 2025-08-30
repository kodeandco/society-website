import React, { useState } from "react";

export default function Management() {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // Board Members
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

  // Committees
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

  const styles = {
    managementPage: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    sectionTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '30px',
      color: '#2c3e50',
      borderBottom: '3px solid #3498db',
      paddingBottom: '10px',
    },
    committeeCard: {
      marginBottom: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      overflow: 'hidden',
    },
    committeeHeader: {
      width: '100%',
      padding: '15px 20px',
      background: '#f8f9fa',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#2c3e50',
      transition: 'background-color 0.3s ease',
    },
    committeeHeaderHover: {
      backgroundColor: '#e9ecef',
    },
    committeeTitle: {
      margin: 0,
      fontSize: '18px',
      fontWeight: '600',
    },
    toggleIcon: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#3498db',
    },
    committeeContent: {
      padding: '20px',
      backgroundColor: '#fff',
    },
    chairmanSection: {
      marginBottom: '20px',
    },
    sectionHeading: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '10px',
      borderBottom: '2px solid #3498db',
      paddingBottom: '5px',
    },
    chairmanCard: {
      padding: '10px 15px',
      backgroundColor: '#e8f4fd',
      border: '1px solid #3498db',
      borderRadius: '5px',
      fontWeight: '600',
      color: '#2c3e50',
    },
    membersSection: {
      marginBottom: '20px',
    },
    membersList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    memberItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 15px',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #dee2e6',
      transition: 'background-color 0.2s ease',
    },
    memberItemHover: {
      backgroundColor: '#e9ecef',
    },
    memberSl: {
      minWidth: '35px',
      fontWeight: 'bold',
      color: '#6c757d',
      fontSize: '14px',
    },
    memberName: {
      flex: 1,
      fontWeight: '500',
      color: '#2c3e50',
      fontSize: '15px',
    },
    memberRole: {
      fontSize: '13px',
      color: '#6c757d',
      fontStyle: 'italic',
      marginLeft: '10px',
    },
  };

  return (
    <div style={styles.managementPage}>
      <h2 style={styles.sectionTitle}>Committees & Management Structure</h2>

      {/* Board Members */}
      <div style={styles.committeeCard}>
        <button 
          onClick={() => toggleSection("board")} 
          style={styles.committeeHeader}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'}
        >
          <h3 style={styles.committeeTitle}>Board Members</h3>
          <span style={styles.toggleIcon}>
            {openSections["board"] ? "−" : "+"}
          </span>
        </button>

        {openSections["board"] && (
          <div style={styles.committeeContent}>
            <ul style={styles.membersList}>
              {boardMembers.map((member) => (
                <li 
                  key={member.slNo} 
                  style={styles.memberItem}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                >
                  <span style={styles.memberSl}>{member.slNo}.</span>
                  <span style={styles.memberName}>{member.name}</span>
                  <span style={styles.memberRole}>{member.designation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Committees */}
      {committees.map((committee) => {
        const isOpen = openSections[committee.id];
        return (
          <div key={committee.id} style={styles.committeeCard}>
            <button
              onClick={() => toggleSection(committee.id)}
              style={styles.committeeHeader}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'}
            >
              <h3 style={styles.committeeTitle}>{committee.title}</h3>
              <span style={styles.toggleIcon}>
                {isOpen ? "−" : "+"}
              </span>
            </button>

            {isOpen && (
              <div style={styles.committeeContent}>
                {committee.chairman && (
                  <div style={styles.chairmanSection}>
                    <h4 style={styles.sectionHeading}>Chairman</h4>
                    <div style={styles.chairmanCard}>{committee.chairman}</div>
                  </div>
                )}

                {committee.members && (
                  <div style={styles.membersSection}>
                    <h4 style={styles.sectionHeading}>Members</h4>
                    <ul style={styles.membersList}>
                      {committee.members.map((member) => (
                        <li 
                          key={member.slNo} 
                          style={styles.memberItem}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                        >
                          <span style={styles.memberSl}>{member.slNo}.</span>
                          <span style={styles.memberName}>{member.name}</span>
                          {member.role && (
                            <span style={styles.memberRole}>{member.role}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {committee.coopted && (
                  <div style={styles.membersSection}>
                    <h4 style={styles.sectionHeading}>Co-Opted Members</h4>
                    <ul style={styles.membersList}>
                      {committee.coopted.map((member) => (
                        <li 
                          key={member.slNo} 
                          style={styles.memberItem}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                        >
                          <span style={styles.memberSl}>{member.slNo}.</span>
                          <span style={styles.memberName}>{member.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {committee.staff && (
                  <div style={styles.membersSection}>
                    <h4 style={styles.sectionHeading}>Staff</h4>
                    <ul style={styles.membersList}>
                      {committee.staff.map((staff) => (
                        <li 
                          key={staff.slNo} 
                          style={styles.memberItem}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                        >
                          <span style={styles.memberSl}>{staff.slNo}.</span>
                          <span style={styles.memberName}>{staff.name}</span>
                          <span style={styles.memberRole}>{staff.role}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}