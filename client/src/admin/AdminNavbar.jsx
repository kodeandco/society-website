import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/login");
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-logo">⚙️ Admin Panel</div>

      <ul className="admin-nav-links">
        <li onClick={() => navigate("/admin/dashboard")}>Dashboard</li>
        <li onClick={() => navigate("/admin/tenders")}>Tenders</li>
        <li onClick={() => navigate("/admin/users")}>Users</li>
        <li onClick={() => navigate("/admin/settings")}>Settings</li>
      </ul>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default AdminNavbar;
