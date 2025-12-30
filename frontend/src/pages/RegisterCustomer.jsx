import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegisterCustomer.css";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      console.log("Map clicked at:", e.latlng.lat, e.latlng.lng);
      onLocationSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function MapZoomController({ onCenterChange }) {
  const map = useMap();

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();

  return (
    <div style={{
      position: "absolute",
      top: "10px",
      right: "10px",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "5px"
    }}>
      <button onClick={handleZoomIn} style={{
        padding: "8px 12px",
        backgroundColor: "#fff",
        border: "2px solid #ccc",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold"
      }}>+</button>
      <button onClick={handleZoomOut} style={{
        padding: "8px 12px",
        backgroundColor: "#fff",
        border: "2px solid #ccc",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold"
      }}>−</button>
    </div>
  );
}

export default function RegisterCustomer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    doorNo: "",
    addressLine: "",
    city: "",
    pincode: "",
    state: "",
    country: "",
    password: "",
    confirmPassword: "",
    latitude: "",
    longitude: ""
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState([17.3850, 78.4867]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationSelect = (coords) => {
    console.log("Location selected:", coords[0].toFixed(4), coords[1].toFixed(4));
    const updatedFormData = {
      ...formData,
      latitude: coords[0].toFixed(4),
      longitude: coords[1].toFixed(4),
    };
    console.log("Updated form data:", updatedFormData);
    setFormData(updatedFormData);
    setShowMap(false);
  };

  const searchLocation = async () => {
    if (!searchInput.trim()) {
      alert("Please enter a city name");
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchInput)}&format=json&limit=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setMapCenter([lat, lon]);
        setSearchInput("");
      } else {
        alert("Location not found. Try another city name.");
      }
    } catch (err) {
      console.error("Search error:", err);
      alert("Error searching location");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.mobile,
        doorNo: formData.doorNo,
        addressLine: formData.addressLine,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
        password: formData.password,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0
      };

      const response = await axios.post("http://localhost:8080/api/customer/signup", payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 201 || response.status === 200) {
        const customerId = response.data.id;
        const userEmail = response.data.email || formData.email;

        // Upload profile image if provided
        if (imageFile && typeof imageFile === 'string' && imageFile.startsWith('data:')) {
          try {
            const base64String = imageFile.split(',')[1];
            console.log("Uploading image with base64 length:", base64String.length);

            const imageFormData = new FormData();
            const binaryString = atob(base64String);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: 'image/png' });
            imageFormData.append('file', blob, 'profile.png');

            await axios.post(`http://localhost:8080/api/customer/${customerId}/upload-image`, imageFormData, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            });
            console.log("Image upload successful");
          } catch (imgErr) {
            console.error("Image upload failed:", imgErr.message);
            // Don't block registration if image upload fails
          }
        }

        // ⭐ Navigate directly to login page (no OTP required)
        alert("Registration Successful! You can now login with your credentials.");
        navigate("/login");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Registration failed. Please try again.";
      alert(errorMsg);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-container">
      <h1>Customer Registration</h1>

      <form className="customer-form" onSubmit={handleSubmit}>

        {/* Profile Picture */}
        <div className="image-upload-section">
          <label className="image-label">Profile Picture (Optional)</label>
          <div className="image-upload-container">
            {imagePreview ? (
              <div className="image-preview-circle">
                <img src={imagePreview} alt="Preview" className="circle-image" />
                <button
                  type="button"
                  className="remove-circle-btn"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="upload-circle-placeholder">
                <span className="circle-upload-icon">📷</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-input"
              disabled={loading}
            />
          </div>
        </div>

        {/* Personal Details */}
        <fieldset className="fieldset-box">
          <legend>Personal Details</legend>

          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., John Doe"
              required
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              placeholder="e.g., john@example.com"
              required
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="text"
              name="mobile"
              placeholder="e.g., 9876543210"
              required
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </fieldset>

        {/* Address Details */}
        <fieldset className="fieldset-box">
          <legend>Address Details</legend>

          <div className="form-group">
            <label>Door Number *</label>
            <input
              type="text"
              name="doorNo"
              placeholder="e.g., 42"
              required
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Address Line *</label>
            <input
              type="text"
              name="addressLine"
              placeholder="e.g., Main Street, Sector 5"
              required
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>City *</label>
            <input
              type="text"
              name="city"
              placeholder="e.g., Mumbai"
              required
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Pincode *</label>
            <input
              type="text"
              name="pincode"
              placeholder="e.g., 400001"
              required
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>State *</label>
            <input
              type="text"
              name="state"
              placeholder="e.g., Maharashtra"
              required
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Country *</label>
            <input
              type="text"
              name="country"
              placeholder="e.g., India"
              required
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </fieldset>

        {/* Password Section */}
        <fieldset className="fieldset-box">
          <legend>Security</legend>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              placeholder="At least 6 characters"
              required
              onChange={handleChange}
              disabled={loading}
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              required
              onChange={handleChange}
              disabled={loading}
              minLength="6"
            />
          </div>
        </fieldset>

        {/* Location */}
        <fieldset className="fieldset-box">
          <legend>Location (Optional)</legend>

          <div className="form-group">
            <label>Latitude (e.g., 14.4426 for Ongole)</label>
            <input
              type="number"
              step="0.0001"
              name="latitude"
              placeholder="e.g., 14.4426"
              value={formData.latitude}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Longitude (e.g., 79.6304 for Ongole)</label>
            <input
              type="number"
              step="0.0001"
              name="longitude"
              placeholder="e.g., 79.6304"
              value={formData.longitude}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button
            type="button"
            onClick={() => setShowMap(!showMap)}
            className="location-btn"
            disabled={loading}
          >
            {showMap ? "Close Map" : "Select Location on Map"}
          </button>

          {showMap && (
            <div className="map-wrapper">
              <div className="map-search-container">
                <input
                  type="text"
                  placeholder="Search city (e.g., Ongole, Hyderabad)"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchLocation()}
                  className="map-search-input"
                />
                <button onClick={searchLocation} className="map-search-btn">Search</button>
              </div>
              <p className="map-tip">
                💡 Tip: Scroll to zoom, drag to pan, click on map to select location
              </p>
              <div className="map-container">
                <MapContainer
                  center={mapCenter}
                  zoom={13}
                  scrollWheelZoom={true}
                  dragging={true}
                  touchZoom={true}
                  doubleClickZoom={true}
                  boxZoom={true}
                  keyboard={true}
                  style={{
                    height: "100%",
                    width: "100%"
                  }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {formData.latitude && formData.longitude && (
                    <Marker position={[parseFloat(formData.latitude), parseFloat(formData.longitude)]} />
                  )}
                  <MapClickHandler onLocationSelect={handleLocationSelect} />
                  <MapZoomController />
                </MapContainer>
                <div className="map-location-hint">
                  📍 Click on map to select location
                </div>
              </div>
            </div>
          )}
        </fieldset>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? "REGISTERING..." : "REGISTER"}
        </button>
      </form>
    </div>
  );
}