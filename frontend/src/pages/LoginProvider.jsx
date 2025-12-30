import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCog } from "react-icons/fa";

export default function LoginProvider() {
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
      const payload = {
        email: form.email,
        password: form.password
      };

      const response = await axios.post("http://localhost:8080/api/provider/login", payload);

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("role", "provider");
      localStorage.setItem("providerName", response.data.name);
      localStorage.setItem("providerId", response.data.id);
      localStorage.setItem("providerEmail", response.data.email || form.email); // ⭐ For WebSocket notifications

      alert("Provider Login Successful!");
      navigate("/provider-profile");
      window.location.reload();
    } catch (err) {
      const errorMessage = err.response?.data || "Login failed. Please check your credentials.";
      alert(errorMessage);
      console.error(err);
    }
  };

  return (
    <div className="login-container">

      {/* Provider Icon */}
      <FaUserCog size={80} color="#0A4D68" />

      <h1>Provider Login</h1>

      <form className="login-form" onSubmit={handleSubmit}>

        <fieldset className="login-fieldset">
          <legend>Enter Details</legend>

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            required
            onChange={handleChange}
          />
        </fieldset>

        <button className="login-btn">Login</button>
      </form>
    </div>
  );
}
