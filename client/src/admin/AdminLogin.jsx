import React, { useState } from "react";
import "./Login.css";
import Button from "./Button";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Hardcoded admin credentials
  const ADMIN_CREDENTIALS = {
    email: "admin@society.com",
    password: "admin123"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check hardcoded credentials first
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        // Create mock admin data
        const adminData = {
          token: "mock-admin-token-" + Date.now(),
          user: {
            id: 1,
            email: email,
            name: "Admin User",
            role: "admin"
          }
        };

        // Store in localStorage
        localStorage.setItem('adminToken', adminData.token);
        localStorage.setItem('adminUser', JSON.stringify(adminData.user));
        
        alert("Login successful!");
        window.location.href = "/admin/dashboard";
        return;
      }

      // If hardcoded credentials don't match, try API call
      const response = await fetch("https://society-website-cpd3.onrender.com/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Failed to log in");

      const data = await response.json();

      if (data.role === "admin") {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        
        alert("Login successful!");
        window.location.href = "/admin/dashboard";
      } else {
        alert("You are not authorized as admin.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin Login</h2>
        
        {/* Display hardcoded credentials for testing */}
        <div style={{ 
          backgroundColor: '#f0f0f0', 
          padding: '10px', 
          marginBottom: '20px', 
          borderRadius: '5px',
          fontSize: '12px',
          color: '#666'
        }}>
         
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            text="Login"
            type="submit"
            variant="primary"
          />
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;