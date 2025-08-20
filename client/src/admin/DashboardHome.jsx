import React, { useState, useEffect } from 'react';
import './DashboardHome.css';

const DashboardHome = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome to Admin Dashboard 👋</h1>
            <p className="text-xl opacity-90 mb-4">Society Management System</p>
            <div className="text-lg opacity-80">
              🕒 {currentTime.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </div>
          <div className="text-6xl animate-bounce">🏢</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
