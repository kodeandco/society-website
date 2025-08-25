import React, { useState } from "react";
import "./Login.css";
import Button from "../components/Button"; // adjust path if needed

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now just log the values (later connect to backend / Firebase / API)
    console.log("Email:", email);
    console.log("Password:", password);

    alert("Login Successful (Demo Only)");
  };
const handleLogin= async()=>{
  try {
    const response = await fetch("https://society-website-cpd3.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Failed to log in");
    }

    const data = await response.json();
    console.log("Login successful:", data);
    alert("Login successful!");
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed. Please try again.");
  }
}
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to continue</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Using common Button component */}
          <Button text="Login" type="submit" variant="primary" onClick={handleLogin}/>
        </form>

        <p className="login-footer">
          Don’t have an account? <a href="#">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
