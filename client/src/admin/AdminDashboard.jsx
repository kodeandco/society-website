import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./AdminDashboard.css";
import AdminNavbar from "./AdminNavbar";
import DashboardHome from "./DashboardHome";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Show DashboardHome if on /admin or /admin/dashboard
  const isDashboard = location.pathname === "/admin/dashboard" || location.pathname === "/admin";

  const handleLogout = () => {
    // Clear auth (if any) and navigate to login
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <AdminNavbar onLogout={handleLogout} />

      <div className="admin-body">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h3>Admin Panel</h3>
          </div>
          <ul className="sidebar-menu">
            <li className="sidebar-item" onClick={() => navigate("/admin/dashboard")}>
              <span className="sidebar-icon">🏠</span> Dashboard
            </li>
            <li className="sidebar-item" onClick={() => navigate("/admin/tenders")}>
              <span className="sidebar-icon">📑</span> Tenders
            </li>
            <li className="sidebar-item" onClick={() => navigate("/admin/reports")}>
              <span className="sidebar-icon">📊</span> Reports
            </li>
            <li className="sidebar-item" onClick={() => navigate("/admin/settings")}>
              <span className="sidebar-icon">⚙️</span> Settings
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {isDashboard ? <DashboardHome /> : <Outlet />}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
