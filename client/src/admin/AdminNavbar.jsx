import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate("/admin-login");
    }
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-logo">⚙️ Admin Panel</div>

      <ul className="admin-nav-links">
        <li onClick={() => navigate("/admin/dashboard")}>Dashboard</li>
        <li onClick={() => navigate("/admin/tenders")}>Tenders</li>
        <li onClick={() => navigate("/admin/gallery")}>Gallery</li>
        <li onClick={() => navigate("/admin/adminannounce")}>Announcements</li>
      </ul>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default AdminNavbar;