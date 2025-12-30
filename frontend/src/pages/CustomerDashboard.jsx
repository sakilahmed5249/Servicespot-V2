import React, { useEffect, useState } from "react";
import "./CustomerDashboard.css";
import "./CustomerProfile.css";
import { FaTools, FaUserEdit, FaHeadset, FaMapMarkerAlt, FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const n = localStorage.getItem("customerName");
    if (n && n !== "undefined" && n !== "null") {
      setName(n);
    }
  }, []);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!localStorage.getItem("loggedIn")) {
      navigate("/login-customer");
    }
  }, []);

  return (
    <div className="dashboard-container">

      {/* Welcome Banner */}
      <div className="dashboard-banner">
        <h2>Welcome back, {name || "Customer"} 👋</h2>
        <p>Your personalized service management dashboard</p>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">

        <div className="action-card">
          <FaTools className="action-icon" />
          <h4>Book a Service</h4>
          <p>Find and book trusted professionals near you</p>
          <button onClick={() => navigate("/book-service")}>Book Now</button>
        </div>

        <div className="action-card">
          <FaClipboardList className="action-icon" />
          <h4>My Bookings</h4>
          <p>View and manage your service requests</p>
          <button onClick={() => navigate("/customer-bookings")}>View</button>
        </div>

        <div className="action-card">
          <FaUserEdit className="action-icon" />
          <h4>Update Profile</h4>
          <p>Edit your personal information</p>
          <button onClick={() => navigate("/customer-update")}>Update</button>
        </div>

        <div className="action-card">
          <FaMapMarkerAlt className="action-icon" />
          <h4>Track Location</h4>
          <p>Detect or change your saved location</p>
          <button onClick={() => navigate("/location")}>Track</button>
        </div>

        <div className="action-card">
          <FaHeadset className="action-icon" />
          <h4>Help & Support</h4>
          <p>Need assistance? We’re here for you</p>
          <button onClick={() => navigate("/contact-help")}>Support</button>
        </div>

      </div>

    </div>
  );
}
