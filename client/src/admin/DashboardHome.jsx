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

      {/* Today's Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          📊 Today's Summary
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">23</div>
            <div className="text-gray-600 font-medium">Tender Views</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">5</div>
            <div className="text-gray-600 font-medium">Downloads</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">2</div>
            <div className="text-gray-600 font-medium">New Members</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl font-bold text-orange-600 mb-2">1</div>
            <div className="text-gray-600 font-medium">New Tenders</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
