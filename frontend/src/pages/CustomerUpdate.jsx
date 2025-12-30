import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CustomerUpdate.css";
import { FaUserEdit, FaMapMarkerAlt, FaUserCircle } from "react-icons/fa";
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

export default function CustomerUpdate() {

  const customerId = localStorage.getItem("customerId") || 1;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    doorNo: "",
    addressLine: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    latitude: "",
    longitude: ""
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState([17.3850, 78.4867]);
  const [searchInput, setSearchInput] = useState("");

  // Fetch existing details
  useEffect(() => {
    fetch(`http://localhost:8080/api/customer/${customerId}`)
      .then(res => res.json())
      .then(data => {
        setForm(data);
        if (data.profileImage) {
          setImagePreview(data.profileImage);
        }
      })
      .catch(err => console.log("Error fetching profile:", err));
  }, []);

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

  // Update form values
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleLocationSelect = (coords) => {
    console.log("Location selected:", coords[0].toFixed(4), coords[1].toFixed(4));
    const updatedForm = {
      ...form,
      latitude: coords[0].toFixed(4),
      longitude: coords[1].toFixed(4)
    };
    console.log("Updated form:", updatedForm);
    setForm(updatedForm);
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

    try {
      await axios.put(`http://localhost:8080/api/customer/${customerId}`, form);
      
      if (imageFile && typeof imageFile === 'string' && imageFile.startsWith('data:')) {
        try {
          const base64String = imageFile.split(',')[1];
          const formData = new FormData();
          const binaryString = atob(base64String);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'image/jpeg' });
          formData.append('file', blob, 'profile.jpg');
          
          await axios.post(`http://localhost:8080/api/customer/${customerId}/upload-image`, formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
        } catch (imgErr) {
          console.warn("Image upload failed:", imgErr.message);
        }
      }
      
      alert("Profile Updated Successfully!");
    } catch (err) {
      alert("Update Failed!");
      console.error(err);
    }
  };

  return (
    <div className="update-container">

      <div className="profile-section">
        <div className="profile-image-area">
          {imagePreview ? (
            <img src={imagePreview} alt="Profile" className="profile-image" />
          ) : (
            <FaUserCircle size={140} color="#0A4D68" />
          )}
        </div>
        <div className="image-upload-wrapper">
          <label className="upload-label">Update Profile Picture</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
            className="image-input"
          />
        </div>
      </div>

      <h1>Update Customer Details</h1>

      <form className="update-form" onSubmit={handleSubmit}>

        {/* PERSONAL DETAILS */}
        <fieldset className="fieldset-box">
          <legend>Personal Details</legend>

          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" placeholder="e.g., John Doe" value={form.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="e.g., john@example.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input type="text" name="phone" placeholder="e.g., 9876543210" value={form.phone} onChange={handleChange} required />
          </div>
        </fieldset>

        {/* ADDRESS DETAILS */}
        <fieldset className="fieldset-box">
          <legend>Address</legend>

          <div className="form-group">
            <label>Door No</label>
            <input type="text" name="doorNo" placeholder="e.g., 42" value={form.doorNo} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Address Line</label>
            <input type="text" name="addressLine" placeholder="e.g., Main Street, Sector 5" value={form.addressLine} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>City</label>
            <input type="text" name="city" placeholder="e.g., Mumbai" value={form.city} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>State</label>
            <input type="text" name="state" placeholder="e.g., Maharashtra" value={form.state} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Country</label>
            <input type="text" name="country" placeholder="e.g., India" value={form.country} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Pincode</label>
            <input type="text" name="pincode" placeholder="e.g., 400001" value={form.pincode} onChange={handleChange} />
          </div>
        </fieldset>

        {/* LOCATION */}
        <fieldset className="fieldset-box">
          <legend>Location</legend>

          <div className="form-group">
            <label>Latitude (e.g., 14.4426 for Ongole)</label>
            <input type="number" step="0.0001" name="latitude" placeholder="e.g., 14.4426" value={form.latitude} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Longitude (e.g., 79.6304 for Ongole)</label>
            <input type="number" step="0.0001" name="longitude" placeholder="e.g., 79.6304" value={form.longitude} onChange={handleChange} />
          </div>

          <button type="button" className="location-btn" onClick={() => setShowMap(!showMap)}>
            <FaMapMarkerAlt /> {showMap ? "Close Map" : "Select Location on Map"}
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
                  {form.latitude && form.longitude && (
                    <Marker position={[parseFloat(form.latitude), parseFloat(form.longitude)]} />
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

        <button type="submit" className="update-btn">Update Profile</button>

      </form>
    </div>
  );
}
