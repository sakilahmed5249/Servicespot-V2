import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaStar, FaPhone, FaEnvelope } from "react-icons/fa";
import "./NearbyServices.css";

// Custom Icons
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const grayIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to update map center when user location is found
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function NearbyServices() {
  const [position, setPosition] = useState(null); // User's location
  const [nearbyProviders, setNearbyProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [selectedService, setSelectedService] = useState("All");
  const [activeService, setActiveService] = useState("All"); // Applied filter
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nearbyDistance, setNearbyDistance] = useState(""); // Input value - empty by default
  const [activeDistance, setActiveDistance] = useState(null); // Applied filter (null = no distance filter)
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }; 



  const isProviderNearby = (provider) => {
    return provider.distance && activeDistance && provider.distance <= activeDistance;
  };

  const handleApplyFilters = () => {
    setActiveService(selectedService);
    const distValue = nearbyDistance === "" ? null : Number(nearbyDistance);
    setActiveDistance(distValue);
  };

  useEffect(() => {
    const fetchCustomerLocation = async () => {
      try {
        const customerId = localStorage.getItem("customerId");
        console.log("Fetching customer location for ID:", customerId);
        if (customerId) {
          const response = await fetch(`http://localhost:8080/api/customer/${customerId}`);
          if (response.ok) {
            const customer = await response.json();
            console.log("Customer data received:", customer);
            console.log("Customer lat:", customer.latitude, "lon:", customer.longitude);
            if (customer.latitude && customer.longitude) {
              console.log("Setting position to:", [customer.latitude, customer.longitude]);
              setPosition([customer.latitude, customer.longitude]);
              setError(null);
              setLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.error("Error fetching customer location:", err);
      }

      // Fallback to browser geolocation
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Browser geolocation obtained:", position.coords);
            setPosition([position.coords.latitude, position.coords.longitude]);
            setError(null);
            setLoading(false);
          },
          (error) => {
            console.error("Browser geolocation error:", error);
            setError("Unable to access your location. Please enable location permissions.");
            setLoading(false);
          }
        );
      } else {
        setError("Geolocation is not supported by your browser.");
        setLoading(false);
      }
    };

    fetchCustomerLocation();
  }, []);

  useEffect(() => {
    if (position) {
      fetchProviders();
    }
  }, [position]);

  // Filter providers when activeService or activeDistance changes and sort by distance
  useEffect(() => {
    let filtered = nearbyProviders;
    
    // Apply service filter
    if (activeService !== "All") {
      filtered = filtered.filter(p => p.serviceType === activeService);
    }
    
    // Apply distance filter if activeDistance is set
    if (activeDistance) {
      filtered = filtered.filter(p => p.distance && p.distance <= activeDistance);
    }
    
    // Sort by distance (closest first)
    filtered = filtered.sort((a, b) => {
      const distA = a.distance || Infinity;
      const distB = b.distance || Infinity;
      return distA - distB;
    });
    
    setFilteredProviders(filtered);
  }, [activeService, activeDistance, nearbyProviders]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/provider/nearby?lat=${position[0]}&lon=${position[1]}&radius=50000`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched providers count:", data.length);
        
        setNearbyProviders(data);

        // Extract unique service types from data
        const types = ["All", ...new Set(data.map(p => p.serviceType))];
        setServiceTypes(types);
        setError(null);
      } else {
        setError("Failed to fetch providers. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching providers:", err);
      setError("Error fetching providers: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (providerId) => {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const role = localStorage.getItem("role");
    
    if (!loggedIn) {
      showToast("Please log in as a customer to book a service.", "warning");
      setTimeout(() => navigate("/login"), 1500);
    } else if (role === "provider" || role === "admin") {
      showToast("Providers and admins cannot book services. Only customers can book.", "error");
    } else {
      navigate("/book-service", { state: { providerId } });
    }
  };

  if (error && !position) {
    return (
      <div className="nearby-services-container">
        <div className="error-container">
          <h2>Location Error</h2>
          <p>{error}</p>
          <p>Please enable location permissions and refresh the page.</p>
        </div>
      </div>
    );
  }

  if (loading || !position) {
    return (
      <div className="nearby-services-container">
        <div className="loading-container">
          <p>Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nearby-services-container">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <p>{toast.message}</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      <div className="nearby-services-header">
        <h1>Nearby Services</h1>
        <p>Find verified service providers in your area</p>
      </div>

      <div className="map-and-filters-container">
        <div className="map-container">
          <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
            <ChangeView center={position} zoom={13} />
            
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User Location Marker - RED */}
            <Marker position={position} icon={redIcon}>
              <Popup>
                <strong>You are here</strong>
              </Popup>
            </Marker>

            {/* Provider Markers - BLUE for Active, GRAY for Inactive */}
            {filteredProviders
              .filter(p => p.latitude && p.longitude)
              .map((provider) => {
                const isInactive = !provider.activeServiceCount || provider.activeServiceCount === 0;
                return (
                <Marker
                  key={provider.id}
                  position={[provider.latitude, provider.longitude]}
                  icon={isInactive ? grayIcon : blueIcon}
                >
                  <Popup>
                    <div className={`provider-popup ${isInactive ? 'inactive' : ''}`}>
                      <h3>{provider.name}</h3>
                      {isInactive && <p className="inactive-status">⚠️ No Active Services</p>}
                      <p className="service-type">{provider.serviceType}</p>
                      <p>{provider.city}, {provider.state}</p>
                      <p>Price: ₹{provider.price}</p>
                      {provider.distance && <p>Distance: {provider.distance.toFixed(2)} km</p>}
                      {!isInactive && (
                        <button onClick={() => handleBookNow(provider.id)}>
                          Book Now
                        </button>
                      )}
                      {isInactive && (
                        <div className="contact-info-popup">
                          <p><FaPhone /> {provider.phone}</p>
                          <p><FaEnvelope /> {provider.email}</p>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
              })}
          </MapContainer>
        </div>

        <div className="filters-sidebar">
          <div className="service-filter">
            <label htmlFor="service-select">Filter by Service: </label>
            <select 
              id="service-select" 
              value={selectedService} 
              onChange={(e) => setSelectedService(e.target.value)}
              className="service-dropdown"
            >
              {serviceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="distance-filter">
            <label htmlFor="distance-input">Show nearby providers within (km): </label>
            <div className="distance-input-wrapper">
              <input 
                id="distance-input" 
                type="number" 
                min="1" 
                max="50000" 
                placeholder="Enter distance"
                value={nearbyDistance}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setNearbyDistance("");
                  } else {
                    const num = Math.max(1, Math.min(50000, Number(val) || 1));
                    setNearbyDistance(num);
                  }
                }}
                className="distance-input"
              />
              <span className="distance-unit">km</span>
            </div>
          </div>

          <button onClick={handleApplyFilters} className="apply-filters-btn">
            Apply Filters
          </button>
        </div>
      </div>

      <div className="nearby-list">
        <h2>{activeService === "All" ? "All Providers" : `${activeService} Providers`}</h2>
        {filteredProviders.length === 0 ? (
            <p>No providers found for the selected service.</p>
        ) : (
            <div className="providers-grid">
                {filteredProviders.map(provider => {
                  const nearby = isProviderNearby(provider);
                  const isInactive = !provider.activeServiceCount || provider.activeServiceCount === 0;
                  return (
                    <div 
                      key={provider.id} 
                      className={`provider-card ${nearby ? "nearby-highlight" : ""} ${provider.verified ? "verified-provider" : "unverified-provider"} ${isInactive ? "inactive-provider" : ""}`}
                    >
                      <div className="card-header">
                        <h3>{provider.name}</h3>
                        <div className="verification-badge">
                          {provider.verified ? (
                            <span className="verified-badge" title="Verified Provider">
                              <FaCheckCircle /> Verified
                            </span>
                          ) : (
                            <span className="unverified-badge" title="Not Yet Verified">
                              <FaTimesCircle /> Unverified
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {nearby && <div className="nearby-tag">Nearby</div>}
                      {isInactive && <div className="inactive-tag">No Services</div>}
                      
                      {isInactive && (
                        <div className="inactive-message">
                          <p className="inactive-status">⚠️ Currently Inactive</p>
                          <p className="status-text">This provider does not have any active services at the moment.</p>
                        </div>
                      )}
                      
                      <p className="service-type">{provider.serviceType}</p>
                      <p>{provider.city}, {provider.state}</p>
                      <p>Price: ₹{provider.price}</p>
                      {provider.distance ? (
                          <p className={`distance ${nearby ? "nearby-distance" : ""}`}>
                            Distance: {provider.distance.toFixed(2)} km
                          </p>
                      ) : (
                          <p className="distance-missing">Location not available</p>
                      )}
                      
                      {!isInactive && (
                        <button onClick={() => handleBookNow(provider.id)} className="book-btn">
                          Book Now
                        </button>
                      )}
                      
                      {isInactive && (
                        <div className="contact-details">
                          <p className="contact-label">Contact Provider to Inquire</p>
                          <div className="contact-info">
                            <p><FaPhone /> <a href={`tel:${provider.phone}`}>{provider.phone}</a></p>
                            <p><FaEnvelope /> <a href={`mailto:${provider.email}`}>{provider.email}</a></p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
        )}
      </div>
    </div>
  );
}
