import React, { useState } from "react";
import Button from "../components/Button";
import "./Signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  const handleSignup= async()=>{
    try {
      const response = await fetch("https://society-website-cpd3.onrender.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }

      const data = await response.json();
      console.log("Signup successful:", data);
      alert("Signup successful!");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Create Your Account</h2>
        <p className="signup-subtitle">Sign up to get started</p>

        <form onSubmit={handleSubmit} className="signup-form">
      

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Using the provided Button component */}
          <Button text="Sign Up" type="submit" variant="primary" onClick={handleSignup} />
        </form>

        <p className="signup-footer">
          Already have an account? <a href="#">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
