import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CustomerProfile.css";
import { FaUserCircle, FaEdit } from "react-icons/fa";

export default function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const customerId = localStorage.getItem("customerId") || 1;

  useEffect(() => {
    fetch(`http://localhost:8080/api/customer/${customerId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then(data => {
        console.log("Customer profile data:", data);
        console.log("Profile image present:", data.profileImage ? `Yes, length: ${data.profileImage.length}` : "No");
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.log("Error fetching profile:", err);
        setError("Unable to load profile. Please try again later.");
        setLoading(false);
      });
  }, [customerId]);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container">
        <p>{error}</p>
        <p>Please ensure the backend server is running on port 8080.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      
      {/* PROFILE IMAGE OR ICON */}
      <div className="profile-icon">
        {profile.profileImage ? (
          <img src={profile.profileImage} alt="Profile" className="profile-image" onError={(e) => {
            console.error("Image load error:", e);
            e.target.src = null;
          }} />
        ) : (
          <FaUserCircle size={120} color="#0A4D68" />
        )}
      </div>

      <h1>Customer Profile</h1>

      <form className="profile-form">
        <div className="form-grid">

          {/* PERSONAL DETAILS */}
          <fieldset className="fieldset-box">
            <legend>Personal Details</legend>

            <div className="field-group">
              <label>Name</label>
              <input type="text" value={profile.name} readOnly />
            </div>

            <div className="field-group">
              <label>Email</label>
              <input type="text" value={profile.email} readOnly />
            </div>

            <div className="field-group">
              <label>Phone</label>
              <input type="text" value={profile.phone} readOnly />
            </div>
          </fieldset>

          {/* ADDRESS DETAILS */}
          <fieldset className="fieldset-box">
            <legend>Address</legend>

            <div className="field-group">
              <label>Door No</label>
              <input type="text" value={profile.doorNo} readOnly />
            </div>

            <div className="field-group">
              <label>Address Line</label>
              <input type="text" value={profile.addressLine} readOnly />
            </div>

            <div className="field-group">
              <label>City</label>
              <input type="text" value={profile.city} readOnly />
            </div>

            <div className="field-group">
              <label>State</label>
              <input type="text" value={profile.state} readOnly />
            </div>

            <div className="field-group">
              <label>Country</label>
              <input type="text" value={profile.country} readOnly />
            </div>

            <div className="field-group">
              <label>Pincode</label>
              <input type="text" value={profile.pincode} readOnly />
            </div>
          </fieldset>

          {/* LOCATION */}
          <fieldset className="fieldset-box">
            <legend>Location</legend>

            <div className="field-group">
              <label>Latitude</label>
              <input type="text" value={profile.latitude} readOnly />
            </div>

            <div className="field-group">
              <label>Longitude</label>
              <input type="text" value={profile.longitude} readOnly />
            </div>

            <div className="field-group verification-box">
              <label>Status</label>
              {profile.verified ? (
                <p className="verified-status">✔ Verified</p>
              ) : (
                <p className="unverified-status">✖ Not Verified</p>
              )}
            </div>
          </fieldset>

        </div>
      </form>

      <Link to="/customer-update" className="edit-profile-btn">
        <FaEdit /> Edit Profile
      </Link>
    </div>
  );
}
