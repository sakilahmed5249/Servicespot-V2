import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";

export default function Search() {

  const [service, setService] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  
  const [services, setServices] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      setLoadingDropdowns(true);
      const [servicesRes, citiesRes] = await Promise.all([
        fetch("http://localhost:8080/api/dropdown/services"),
        fetch("http://localhost:8080/api/dropdown/cities")
      ]);

      if (servicesRes.ok && citiesRes.ok) {
        const servicesData = await servicesRes.json();
        const citiesData = await citiesRes.json();
        
        const uniqueServices = [...new Set(servicesData || [])];
        const uniqueCities = [...new Set(citiesData || [])];
        
        setServices(uniqueServices);
        setCities(uniqueCities);
      }
    } catch (err) {
      console.error("Error loading dropdown data:", err);
    } finally {
      setLoadingDropdowns(false);
    }
  };

  const fetchAreasByCity = async (selectedCity) => {
    if (!selectedCity) {
      setAreas([]);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8080/api/dropdown/areas?city=${encodeURIComponent(selectedCity)}`);
      if (response.ok) {
        const areasData = await response.json();
        const uniqueAreas = [...new Set(areasData || [])];
        setAreas(uniqueAreas);
      }
    } catch (err) {
      console.error("Error loading areas:", err);
      setAreas([]);
    }
  };

  const getFilteredServices = () => {
    if (!service.trim()) return services;
    return services.filter(s => 
      s.toLowerCase().includes(service.toLowerCase())
    );
  };

  const getFilteredCities = () => {
    if (!city.trim()) return cities;
    return cities.filter(c => 
      c.toLowerCase().includes(city.toLowerCase())
    );
  };

  const getFilteredAreas = () => {
    if (!area.trim()) return areas;
    return areas.filter(a => 
      a.toLowerCase().includes(area.toLowerCase())
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setError("");

    if (!service.trim() && !area.trim() && !city.trim()) {
      setError("Please enter at least one search criteria (Service, Area, or City)");
      return;
    }

    navigate(
      `/search?service=${encodeURIComponent(service)}&area=${encodeURIComponent(area)}&city=${encodeURIComponent(city)}`
    );
  };

  return (
    <form className="search-box" onSubmit={handleSearch}>
      <div className="search-header">
        <p>Instantly match with verified pros near you</p>
        <h3>Find the help you need in seconds</h3>
      </div>

      {error && <div className="search-error">{error}</div>}

      <div className="search-grid">
        <div className="search-field dropdown-field">
          <label><span>Service Type</span></label>
          <div className="dropdown-container">
            <input
              type="text"
              placeholder={loadingDropdowns ? "Loading services..." : "Enter or select a service..."}
              value={service}
              onChange={(e) => setService(e.target.value)}
              onFocus={() => setShowServiceDropdown(true)}
              onBlur={() => setTimeout(() => setShowServiceDropdown(false), 200)}
              className="dropdown-input"
              disabled={loadingDropdowns}
            />
            {showServiceDropdown && services.length > 0 && (
              <div className="dropdown-menu">
                {getFilteredServices().length > 0 ? (
                  getFilteredServices().map(s => (
                    <div 
                      key={s} 
                      className="dropdown-item"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setService(s);
                        setShowServiceDropdown(false);
                      }}
                    >
                      {s}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item" style={{color: '#888', fontStyle: 'italic'}}>
                    No matches - use custom input
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="search-field dropdown-field">
          <label><span>City</span></label>
          <div className="dropdown-container">
            <input
              type="text"
              placeholder={loadingDropdowns ? "Loading cities..." : "Enter or select a city..."}
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setArea("");
                if (e.target.value) {
                  fetchAreasByCity(e.target.value);
                }
              }}
              onFocus={() => setShowCityDropdown(true)}
              onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
              className="dropdown-input"
              disabled={loadingDropdowns}
            />
            {showCityDropdown && cities.length > 0 && (
              <div className="dropdown-menu">
                {getFilteredCities().length > 0 ? (
                  getFilteredCities().map(c => (
                    <div 
                      key={c} 
                      className="dropdown-item"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setCity(c);
                        setArea("");
                        fetchAreasByCity(c);
                        setShowCityDropdown(false);
                      }}
                    >
                      {c}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item" style={{color: '#888', fontStyle: 'italic'}}>
                    No matches - use custom input
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="search-field dropdown-field">
          <label><span>Area / Locality</span></label>
          <div className="dropdown-container">
            <input
              type="text"
              placeholder={city ? "Enter or select an area..." : "Select city first"}
              value={area}
              onChange={(e) => setArea(e.target.value)}
              onFocus={() => setShowAreaDropdown(true)}
              onBlur={() => setTimeout(() => setShowAreaDropdown(false), 200)}
              disabled={!city}
              className={`dropdown-input ${!city ? 'disabled' : ''}`}
            />
            {showAreaDropdown && city && areas.length > 0 && (
              <div className="dropdown-menu">
                {getFilteredAreas().length > 0 ? (
                  getFilteredAreas().map(a => (
                    <div 
                      key={a} 
                      className="dropdown-item"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setArea(a);
                        setShowAreaDropdown(false);
                      }}
                    >
                      {a}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item" style={{color: '#888', fontStyle: 'italic'}}>
                    No matches - use custom input
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <button type="submit" className="search-submit">Search Services</button>
    </form>
  );
}
