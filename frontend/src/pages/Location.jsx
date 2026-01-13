import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { FaMapMarkerAlt, FaCrosshairs, FaSave, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Location.css";

// Custom Icons
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to update map center
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// Map Click Handler
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function Location() {
  const [position, setPosition] = useState([17.3850, 78.4867]); // Default: Hyderabad
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const customerId = localStorage.getItem("customerId");

  useEffect(() => {
    if (!customerId) {
      navigate("/login-customer");
      return;
    }
    fetchCustomerData();
  }, [customerId]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/api/customer/${customerId}`);
      setCustomer(res.data);
      if (res.data.latitude && res.data.longitude) {
        setPosition([res.data.latitude, res.data.longitude]);
      } else {
        detectLocation();
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      detectLocation();
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPos);
          setMessage({ type: "success", text: "Current location detected!" });
          setTimeout(() => setMessage(null), 3000);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setMessage({ type: "error", text: "Unable to detect location. Please select on map." });
        }
      );
    } else {
      setMessage({ type: "error", text: "Geolocation is not supported by your browser." });
    }
  };

  const handleLocationSelect = (coords) => {
    setPosition(coords);
  };

  const handleSaveLocation = async () => {
    if (!customer) return;
    
    setSaving(true);
    try {
      const updatedCustomer = {
        ...customer,
        latitude: position[0].toFixed(6),
        longitude: position[1].toFixed(6)
      };
      
      await axios.put(`http://localhost:8080/api/customer/${customerId}`, updatedCustomer);
      setMessage({ type: "success", text: "Location saved successfully!" });
      setTimeout(() => navigate("/customer-dashboard"), 2000);
    } catch (error) {
      console.error("Error saving location:", error);
      setMessage({ type: "error", text: "Failed to save location." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="location-page-loading">Loading map...</div>;
  }

  return (
    <div className="location-page-container">
      <div className="location-header">
        <button className="back-btn" onClick={() => navigate("/customer-dashboard")}>
          <FaArrowLeft /> Back
        </button>
        <h1>Track & Manage Location</h1>
        <p>Detect your current position or select your preferred service location on the map.</p>
      </div>

      {message && (
        <div className={`location-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="location-map-card">
        <div className="map-controls">
          <button className="detect-btn" onClick={detectLocation}>
            <FaCrosshairs /> Detect My Location
          </button>
          <div className="coords-display">
            <span>Lat: {parseFloat(position[0]).toFixed(4)}</span>
            <span>Long: {parseFloat(position[1]).toFixed(4)}</span>
          </div>
        </div>

        <div className="location-map-container">
          <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
            <ChangeView center={position} zoom={13} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={redIcon}>
              <Popup>
                <strong>Selected Location</strong><br />
                This is where you'll receive services.
              </Popup>
            </Marker>
            <MapClickHandler onLocationSelect={handleLocationSelect} />
          </MapContainer>
          <div className="map-hint">
            📍 Click anywhere on the map to change your location
          </div>
        </div>

        <div className="location-actions">
          <button 
            className="save-location-btn" 
            onClick={handleSaveLocation}
            disabled={saving}
          >
            <FaSave /> {saving ? "Saving..." : "Save Location"}
          </button>
        </div>
      </div>
    </div>
  );
}
