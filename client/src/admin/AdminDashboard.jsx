// AdminDashboard.jsx
import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./AdminDashboard.css";
import AdminNavbar from "./AdminNavbar";
import DashboardHome from "./DashboardHome";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/admin/dashboard" || location.pathname === "/admin";

  return (
    <div className="admin-dashboard">
      <AdminNavbar />

      <div className="admin-body">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h3>Admin Panel</h3>
          </div>
          <ul className="sidebar-menu">
            <li className="sidebar-item" onClick={() => navigate("/admin/dashboard")}>
              <span className="sidebar-icon">🏠</span>
              <span>Dashboard</span>
            </li>
            <li className="sidebar-item" onClick={() => navigate("/admin/tenders")}>
              <span className="sidebar-icon">📑</span>
              <span>Tenders</span>
            </li>
            <li className="sidebar-item" onClick={() => navigate("/admin/reports")}>
              <span className="sidebar-icon">📊</span>
              <span>Gallery</span>
            </li>
            <li className="sidebar-item" onClick={() => navigate("/admin/settings")}>
              <span className="sidebar-icon">⚙️</span>
              <span>Settings</span>
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
