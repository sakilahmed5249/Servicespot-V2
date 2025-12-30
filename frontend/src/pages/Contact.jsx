import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Contact.css";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaHome } from "react-icons/fa";

export default function Contact() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage("");
    setSubmitError("");

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
        isResolved: false
      };

      await axios.post("http://localhost:8080/api/contact", payload);
      
      setSubmitMessage("✓ Message submitted successfully! We will contact you soon.");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });

      setTimeout(() => {
        setSubmitMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error submitting message:", error);
      setSubmitError("Failed to submit message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">

      <div className="contact-header">
        <h1>Contact & Help</h1>
        <button className="home-btn" onClick={() => navigate("/")} title="Back to Home">
          <FaHome /> Home
        </button>
      </div>

      {/* Contact Details */}
      <div className="contact-info">
        <h2>Need Help? Reach Us</h2>

        <p><FaPhone /> +91 9876543210</p>
        <p><FaEnvelope /> support@servicespot.com</p>
        <p><FaMapMarkerAlt /> ServiceSpot Office, Guntur, Andhra Pradesh</p>
      </div>

      {/* Contact Form */}
      <form className="contact-form" onSubmit={handleSubmit}>

        <fieldset className="contact-fieldset">
          <legend>Contact Form</legend>

          {submitMessage && <div className="success-message">{submitMessage}</div>}
          {submitError && <div className="error-message">{submitError}</div>}

          <label>Your Name *</label>
          <input 
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <label>Your Email *</label>
          <input 
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <label>Your Phone</label>
          <input 
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={loading}
            placeholder="e.g., 9876543210"
          />

          <label>Subject *</label>
          <input 
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="e.g., Account Issue, Booking Problem"
          />

          <label>Your Message *</label>
          <textarea 
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            disabled={loading}
            rows="5"
          ></textarea>

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>

        </fieldset>

      </form>

      {/* Help / FAQ */}
      <div className="help-section">
        <h2>Help & FAQs</h2>

        <details>
          <summary>How do I register as a customer?</summary>
          <p>Go to the Register page and choose Customer registration.</p>
        </details>

        <details>
          <summary>How do I register as a service provider?</summary>
          <p>Choose Provider registration and enter service details.</p>
        </details>

        <details>
          <summary>How to search for providers?</summary>
          <p>Use the Search section and enter service, area, and city.</p>
        </details>

        <details>
          <summary>Can I update my profile?</summary>
          <p>Yes, customers and providers can update their details anytime.</p>
        </details>

      </div>

    </div>
  );
}
