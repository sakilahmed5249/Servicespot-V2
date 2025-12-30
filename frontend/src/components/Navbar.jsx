import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaSearch } from "react-icons/fa";
import NotificationBell from "./NotificationBell";

export default function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const role = localStorage.getItem("role");

  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);

  // Hide Logout on login pages
  const loginPages = [
    "/login",
    "/login-customer",
    "/login-provider",
    "/login-admin"
  ];

  // Fetch services from backend
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const response = await fetch("http://localhost:8080/api/dropdown/services");
      if (response.ok) {
        const data = await response.json();
        setServices(data || []);
      } else {
        setServices([
          "Electrician",
          "Plumber",
          "Mechanic",
          "Gardening",
          "Painter",
          "Home Cleaning"
        ]);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setServices([
        "Electrician",
        "Plumber",
        "Mechanic",
        "Gardening",
        "Painter",
        "Home Cleaning"
      ]);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);

    if (!val.trim()) {
      setFiltered([]);
      return;
    }

    setFiltered(
      services.filter(s => s.toLowerCase().includes(val.toLowerCase()))
    );
  };

  const handleServiceSelect = (service) => {
    setSearch(service);
    setFiltered([]);
    setShowDropdown(false);
    navigate(`/search?service=${encodeURIComponent(service)}&area=&city=`);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">

      <div className="navbar-left">
        <h2 className="logo">Service<span>Spot</span></h2>
      </div>

      {/* Search Bar */}
      <div className="navbar-center">
        <form className="navbar-search">
          <FaSearch className="search-icon" />

          <input 
            type="text"
            placeholder={loadingServices ? "Loading services..." : "Search services…"}
            value={search}
            onChange={handleSearchChange}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />

          {showDropdown && (
            <div className="dropdown-list">
              {loadingServices ? (
                <div className="dropdown-loading">Loading services...</div>
              ) : search.trim() ? (
                filtered.length > 0 ? (
                  filtered.map((item, i) => (
                    <div 
                      key={i} 
                      className="dropdown-item"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleServiceSelect(item);
                      }}
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-no-results">No services found</div>
                )
              ) : (
                services.map((item, i) => (
                  <div 
                    key={i} 
                    className="dropdown-item"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleServiceSelect(item);
                    }}
                  >
                    {item}
                  </div>
                ))
              )}
            </div>
          )}
        </form>
      </div>

      <div className="navbar-right">
        <ul className="nav-links">

          <li><Link to="/">Home</Link></li>
          <li><Link to="/nearby-services">Nearby Services</Link></li>

          {!loggedIn && (
            <>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
            </>
          )}

          {loggedIn && role === "customer" && (
            <>
              <li><Link to="/customer-dashboard">Dashboard</Link></li>
              <li><Link to="/customer-profile">Profile</Link></li>
            </>
          )}

          {loggedIn && role === "provider" && (
            <>
              <li><Link to="/provider-dashboard">Dashboard</Link></li>
              <li><Link to="/provider-profile">Profile</Link></li>
            </>
          )}

          {loggedIn && role === "admin" && (
            <>
              <li><Link to="/admin-dashboard">Dashboard</Link></li>
              <li><Link to="/admin-providers">Providers</Link></li>
              <li><Link to="/admin-customers">Customers</Link></li>
            </>
          )}
        </ul>

        {/* Notification Bell for logged-in users */}
        {loggedIn && <NotificationBell />}

        {/* ⭐ Hide logout on login pages */}
        {loggedIn && !loginPages.includes(location.pathname) && (
          <button className="logout-btn" onClick={logout}>Logout</button>
        )}

      </div>
    </nav>
  );
}
