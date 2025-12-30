import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaStar, FaCheck, FaFilter, FaUserTie } from "react-icons/fa";
import "./SearchResults.css";

export default function SearchResults() {
  
  const location = useLocation();
  const navigate = useNavigate();

  const service = new URLSearchParams(location.search).get("service") || "";
  const area = new URLSearchParams(location.search).get("area") || "";
  const city = new URLSearchParams(location.search).get("city") || "";

  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("relevant");
  const [priceRange, setPriceRange] = useState(10000);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleBookNow = (item) => {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const role = localStorage.getItem("role");
    
    if (!loggedIn) {
      showToast("Please log in as a customer to book a service.", "warning");
      setTimeout(() => navigate("/login-customer"), 1500);
      return;
    }
    
    if (role === "provider" || role === "admin") {
      showToast("Providers and admins cannot book services. Only customers can book.", "error");
      return;
    }
    
    navigate("/book-service", { 
      state: { 
        preSelectedService: item, 
        searchContext: {
          service,
          area,
          city
        }
      }
    });
  };

  useEffect(() => {
    const searchParams = new URLSearchParams();
    if (service.trim()) searchParams.append('service', service);
    if (area.trim()) searchParams.append('area', area);
    if (city.trim()) searchParams.append('city', city);

    const queryString = searchParams.toString();
    
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        if (service.trim()) params.append('service', service);
        if (area.trim()) params.append('area', area);
        if (city.trim()) params.append('city', city);
        
        const url = `http://localhost:8080/api/search?${params.toString()}`;
        console.log("Searching providers from:", url);
        const res = await fetch(url);
        
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to search providers`);
        const allResults = await res.json();
        console.log("Search results:", allResults);
        
        console.log("Total results found:", allResults.length);
        setResults(allResults);
        applyFiltersAndSort(allResults, sortBy, priceRange);
      } catch (error) {
        console.error("Error loading search data:", error);
        setError(`Error: ${error.message}. Make sure the backend server is running on port 8080.`);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [service, area, city]);

  const applyFiltersAndSort = (data, sort, price) => {
    let filtered = [...data];

    filtered = filtered.filter(p => (p.price || 0) <= price);

    if (sort === "price-low") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === "price-high") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === "verified") {
      filtered.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));
    }

    setFilteredResults(filtered);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    applyFiltersAndSort(results, newSort, priceRange);
  };

  const handlePriceChange = (newPrice) => {
    setPriceRange(newPrice);
    applyFiltersAndSort(results, sortBy, newPrice);
  };

  return (
    <div className="search-results-wrapper">
      <div className="results-hero">
        <div className="hero-content">
          <span className="hero-badge">Curated Matches</span>
          <h1>Professionals tailored to your search</h1>
          <p>Find trusted service providers in your area with verified ratings and instant booking</p>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-state">Finding perfect professionals for you...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>{error}</p>
          <p>Please make sure the backend server is running on port 8080.</p>
        </div>
      )}

      {!loading && !error && (
        <div className="results-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <div className="filters-header">
              <FaFilter /> Filters
            </div>

            {/* Search Tags */}
            <div className="filter-section">
              <h4>Your Search</h4>
              <div className="search-tags">
                {service && <span className="tag">{service} <span className="tag-icon">✓</span></span>}
                {area && <span className="tag">{area} <span className="tag-icon">✓</span></span>}
                {city && <span className="tag">{city} <span className="tag-icon">✓</span></span>}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-section">
              <h4>Price Range</h4>
              <div className="price-filter">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => handlePriceChange(Number(e.target.value))}
                  className="price-slider"
                />
                <p className="price-display">Up to ₹{priceRange.toLocaleString()}</p>
              </div>
            </div>

            {/* Sort Options */}
            <div className="filter-section">
              <h4>Sort By</h4>
              <div className="sort-options">
                <label className="sort-option">
                  <input
                    type="radio"
                    name="sort"
                    value="relevant"
                    checked={sortBy === "relevant"}
                    onChange={() => handleSortChange("relevant")}
                  />
                  Most Relevant
                </label>
                <label className="sort-option">
                  <input
                    type="radio"
                    name="sort"
                    value="price-low"
                    checked={sortBy === "price-low"}
                    onChange={() => handleSortChange("price-low")}
                  />
                  Price: Low to High
                </label>
                <label className="sort-option">
                  <input
                    type="radio"
                    name="sort"
                    value="price-high"
                    checked={sortBy === "price-high"}
                    onChange={() => handleSortChange("price-high")}
                  />
                  Price: High to Low
                </label>
                <label className="sort-option">
                  <input
                    type="radio"
                    name="sort"
                    value="verified"
                    checked={sortBy === "verified"}
                    onChange={() => handleSortChange("verified")}
                  />
                  Verified First
                </label>
              </div>
            </div>

            {/* Results Count */}
            <div className="results-count">
              <p><strong>{filteredResults.length}</strong> results found</p>
            </div>
          </aside>

          {/* Results Grid */}
          <main className="results-main">
            {filteredResults.length === 0 && !loading ? (
              <div className="no-results">
                <p className="no-results-icon">🔍</p>
                <h3>No services found</h3>
                <p>Try adjusting your search criteria or price range</p>
              </div>
            ) : (
              <div className="results-grid">
                {filteredResults.map((provider, index) => (
                  <article className="result-card" key={`${provider.id || provider.name}-${index}`}>
                    {provider.verified && <div className="verified-badge"><FaCheck /> Verified</div>}
                    
                    <div className="card-header">
                      <div className="provider-avatar-section">
                        {provider.profileImage ? (
                          <img src={provider.profileImage} alt={provider.name} className="search-result-avatar" />
                        ) : (
                          <div className="search-result-avatar-placeholder">
                            <FaUserTie />
                          </div>
                        )}
                      </div>
                      <div className="provider-header">
                        <h3>{provider.name}</h3>
                        <span className="service-type">{provider.serviceType || "Service Provider"}</span>
                      </div>
                    </div>

                    <div className="card-content">
                      <div className="info-block">
                        <div className="info-item">
                          <FaMapMarkerAlt className="icon" />
                          <div>
                            <label>Location</label>
                            <p>{provider.city}, {provider.state}</p>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaPhone className="icon" />
                          <div>
                            <label>Phone</label>
                            <p>{provider.phone || "Not available"}</p>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaEnvelope className="icon" />
                          <div>
                            <label>Email</label>
                            <p>{provider.email || "Not available"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="price-rating">
                        <div className="price-section">
                          <label>Price</label>
                          <p className="price">{provider.price ? `₹${provider.price.toLocaleString()}` : "Price on request"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer">
                      <button 
                        type="button" 
                        className="book-btn"
                        onClick={() => handleBookNow(provider)}
                      >
                        Book Now
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>
        </div>
      )}
      
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <p>{toast.message}</p>
        </div>
      )}
    </div>
  );
}
