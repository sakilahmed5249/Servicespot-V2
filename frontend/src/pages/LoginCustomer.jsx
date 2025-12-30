import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

export default function LoginCustomer() {

  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  useEffect(() => {
    // Check if redirected from registration or password reset
    if (location.state?.message) {
      setMessage(location.state.message);
      setMessageType("success");
      
      // Pre-fill email if provided
      if (location.state?.email) {
        setForm({ ...form, email: location.state.email });
      }
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
    }

    // If already logged in, redirect
    if (localStorage.getItem("loggedIn") === "true" &&
        localStorage.getItem("role") === "customer") {
      navigate("/customer-dashboard");
    }
  }, [location.state]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    try {
      const loginRes = await axios.post("http://localhost:8080/api/customer/login", form);

      if (loginRes.data.success && loginRes.data.customer) {
        const customer = loginRes.data.customer;
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("role", "customer");
        localStorage.setItem("customerName", customer.name);
        localStorage.setItem("customerId", customer.id);
        localStorage.setItem("customerEmail", customer.email || form.email);

        setMessage("Login Successful!");
        setMessageType("success");
        
        setTimeout(() => {
          navigate("/customer-dashboard");
        }, 1000);
      } else {
        setMessage(loginRes.data.message || "Login Failed");
        setMessageType("error");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login Failed. Please check your credentials.";
      
      // Check if it's an email verification error
      if (errorMessage.includes("verify your email")) {
        setMessage(errorMessage);
        setMessageType("error");
        
        // Redirect to OTP verification page
        setTimeout(() => {
          navigate("/verify-email", { state: { email: form.email } });
        }, 2000);
      } else {
        setMessage(errorMessage);
        setMessageType("error");
      }
      
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <FaUserCircle size={80} color="#0A4D68" />
      <h1>Customer Login</h1>

      {message && (
        <div className={`login-message ${messageType}`}>
          {message}
        </div>
      )}

      <form className="login-form" onSubmit={handleSubmit}>
        <fieldset className="login-fieldset">
          <legend>Enter Details</legend>

          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            value={form.email}
            required 
            onChange={handleChange} 
          />

          <label>Password</label>
          <input 
            type="password" 
            name="password" 
            required 
            onChange={handleChange} 
          />

          <div className="forgot-password-link-container">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>

        </fieldset>

        <button className="login-btn">Login</button>
      </form>

      <div className="register-link-container">
        <p>Don't have an account? <Link to="/register-customer">Register here</Link></p>
      </div>
    </div>
  );
}