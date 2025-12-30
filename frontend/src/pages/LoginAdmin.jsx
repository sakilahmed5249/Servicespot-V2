import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";   // Admin icon

export default function LoginAdmin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("role", "admin");
        localStorage.setItem("adminId", data.id);
        localStorage.setItem("adminName", data.name);
        localStorage.setItem("adminEmail", data.email || form.email); // ⭐ For WebSocket notifications

        alert("Admin Login Successful!");
        navigate("/admin-dashboard");
        window.location.reload();
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error connecting to server. Please try again.");
    }
  };

  return (
    <div className="login-container">

      {/* Admin Icon */}
      <FaUserShield size={80} color="#0A4D68" />

      <h1>Admin Login</h1>

      <form className="login-form" onSubmit={handleSubmit}>

        <fieldset className="login-fieldset">
          <legend>Enter Details</legend>

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter admin email"
            required
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter admin password"
            required
            onChange={handleChange}
          />
        </fieldset>

        <button className="login-btn">Login</button>
      </form>
    </div>
  );
}
