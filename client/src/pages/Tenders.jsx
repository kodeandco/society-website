import React from 'react';
import './Tenders.css';

const tenders = [
  {
    title: 'Supply and Installation of Solar Panels',
    posted: '2025-08-10',
    deadline: '2025-08-25',
    download: '#',
  },
  {
    title: 'Annual Maintenance Contract for Lifts',
    posted: '2025-08-12',
    deadline: '2025-08-28',
    download: '#',
  },
  {
    title: 'Painting of Building Exteriors',
    posted: '2025-08-15',
    deadline: '2025-08-30',
    download: '#',
  },
];

function Tenders() {
  return (
    <div className="tenders-container">
      <h1 className="tenders-title">Tenders</h1>
      <div className="tenders-vertical-list">
        {tenders.map((t, i) => (
          <div className="tender-card" key={i}>
            <h2>{t.title}</h2>
            <div className="tender-dates">
              <span>Posted: {t.posted}</span>
              <span>Deadline: {t.deadline}</span>
            </div>
            <a className="tender-btn" href={t.download} download>
              Download Tender Document
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tenders;
