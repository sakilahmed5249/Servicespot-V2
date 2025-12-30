import React, { useEffect, useState, useCallback } from "react";
import "./BookService.css";
import axios from "axios";
import {
  FaCalendarAlt,
  FaClock,
  FaUserTie,
  FaRupeeSign,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowLeft
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function BookService() {
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("All Categories");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const [serviceNames, setServiceNames] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [serviceSearch, setServiceSearch] = useState("");

  // Clear provider filter when user manually changes filters
  const handleCategoryChange = (catId, catName) => {
    setSelectedCategory(catId);
    setSelectedCategoryName(catName);
    setCategorySearch("");
    setShowCategoryDropdown(false);
    setFilterByProviderId(null); // Clear provider filter on manual change
  };

  const handleCityChange = (cityName) => {
    setCity(cityName);
    setCitySearch("");
    setShowCityDropdown(false);
    setFilterByProviderId(null); // Clear provider filter on manual change
  };

  const handleServiceChange = (serviceName) => {
    setServiceName(serviceName);
    setServiceSearch("");
    setShowServiceDropdown(false);
    setFilterByProviderId(null); // Clear provider filter on manual change
  };

  const [allServices, setAllServices] = useState([]);
  const [services, setServices] = useState([]);
  const [inactiveServices, setInactiveServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [filterByProviderId, setFilterByProviderId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search context from navigation state
  const [searchContext, setSearchContext] = useState({
    service: "",
    area: "",
    city: ""
  });

  // Extract search context and handle login redirect
  useEffect(() => {
    if (!localStorage.getItem("loggedIn")) {
      alert("Please login first.");
      navigate("/login");
    }

    // Extract search context from navigation state
    if (location.state?.searchContext) {
      setSearchContext(location.state.searchContext);
      // Pre-populate city field if available
      if (location.state.searchContext.city) {
        setCity(location.state.searchContext.city);
      }
    }

    // Pre-select service if coming from search results (service or provider)
    if (location.state?.preSelectedService) {
      const preSelected = location.state.preSelectedService;
      if (preSelected.provider) {
        setSelectedService(preSelected);
      } else if (preSelected.serviceId) {
        preSelected.id = preSelected.serviceId;
        setSelectedService(preSelected);
      } else if (preSelected.name && !preSelected.category) {
        setFilterByProviderId(preSelected.id);
        if (preSelected.city) {
          setCity(preSelected.city);
        }
      }
    } else if (location.state?.providerId) {
      // Handle direct provider selection from NearbyServices
      setFilterByProviderId(location.state.providerId);
    } else {
      // Clear provider filter if not coming from search results
      setFilterByProviderId(null);
      localStorage.removeItem("selectedProviderId");
    }
  }, [navigate, location.state?.searchContext, location.state?.preSelectedService, location.state?.providerId]);

  // Fetch reviews when a service is selected
  const fetchReviews = async (serviceId) => {
    if (!serviceId) return;
    setLoadingReviews(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/rating/service/${serviceId}`);
      setReviews(res.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Fetch reviews when selectedService changes
  useEffect(() => {
    if (selectedService?.id) {
      fetchReviews(selectedService.id);
    } else {
      setReviews([]);
    }
  }, [selectedService?.id]);

  // Fetch all categories and services on load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await initializeDemoDataIfNeeded();
        await fetchCategories();
        await fetchAllServices();
      } catch {
        setError("Failed to load services. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Initialize demo data if no services exist
  const initializeDemoDataIfNeeded = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/services");
      if (!res.data || res.data.length === 0) {
        await axios.post("http://localhost:8080/api/init/demo-data");
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch {
      // Silently fail
    }
  };

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/category");
      setCategories(res.data);
    } catch {
      // Silently fail
    }
  };

  // Fetch all available services
  const fetchAllServices = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/services");

      if (res.data && Array.isArray(res.data)) {
        const citiesSet = new Set();
        const serviceNamesSet = new Set();
        res.data.forEach((s) => {
          if (s.city) citiesSet.add(s.city);
          if (s.name) serviceNamesSet.add(s.name);
        });
        const citiesArray = Array.from(citiesSet).sort();
        const serviceNamesArray = Array.from(serviceNamesSet).sort();
        setCities(citiesArray);
        setServiceNames(serviceNamesArray);
      }

      const fullServices = res.data || [];
      setAllServices(fullServices);
      setServices(fullServices);
    } catch {
      setAllServices([]);
      setServices([]);
    }
  };

  // Helper function: Get available categories based on city and service name selections
  const getAvailableCategories = useCallback(() => {
    if (allServices.length === 0) return categories;

    let filtered = [...allServices];

    // Filter by selected city
    if (city && city.trim() !== "") {
      filtered = filtered.filter(s =>
        s.city && s.city.toLowerCase() === city.toLowerCase()
      );
    }

    // Filter by selected service name
    if (serviceName && serviceName.trim() !== "") {
      filtered = filtered.filter(s =>
        s.name && s.name.toLowerCase() === serviceName.toLowerCase()
      );
    }

    // Extract available category IDs
    const availableCategoryIds = new Set(
      filtered.map(s => s.category?.id).filter(Boolean)
    );

    // Return only categories that exist in filtered services
    return categories.filter(cat => availableCategoryIds.has(cat.id));
  }, [allServices, categories, city, serviceName]);

  // Helper function: Get available services based on category and city selections
  const getAvailableServiceNames = useCallback(() => {
    if (allServices.length === 0) return serviceNames;

    let filtered = [...allServices];

    // Filter by selected category
    if (selectedCategory && selectedCategory !== "") {
      filtered = filtered.filter(s =>
        s.category?.id === parseInt(selectedCategory)
      );
    }

    // Filter by selected city
    if (city && city.trim() !== "") {
      filtered = filtered.filter(s =>
        s.city && s.city.toLowerCase() === city.toLowerCase()
      );
    }

    // Extract available service names
    const availableNames = new Set(
      filtered.map(s => s.name).filter(Boolean)
    );

    // Return sorted service names
    return Array.from(availableNames).sort();
  }, [allServices, serviceNames, selectedCategory, city]);

  // Helper function: Get available cities based on category and service name selections
  const getAvailableCities = useCallback(() => {
    if (allServices.length === 0) return cities;

    let filtered = [...allServices];

    // Filter by selected category
    if (selectedCategory && selectedCategory !== "") {
      filtered = filtered.filter(s =>
        s.category?.id === parseInt(selectedCategory)
      );
    }

    // Filter by selected service name
    if (serviceName && serviceName.trim() !== "") {
      filtered = filtered.filter(s =>
        s.name && s.name.toLowerCase() === serviceName.toLowerCase()
      );
    }

    // Extract available cities
    const availableCitiesSet = new Set(
      filtered.map(s => s.city).filter(Boolean)
    );

    // Return sorted cities
    return Array.from(availableCitiesSet).sort();
  }, [allServices, cities, selectedCategory, serviceName]);

  // Filter services by category and city
  const applyFilters = useCallback(() => {
    if (allServices.length === 0) {
      setServices([]);
      return;
    }

    let filtered = [...allServices];

    // Step 1: Filter by city
    if (city && city.trim() !== "") {
      filtered = filtered.filter((s) => {
        const match = s.city && s.city.toLowerCase().includes(city.toLowerCase());
        return match;
      });
    }

    // Step 2: Filter by category (only if specifically selected)
    if (selectedCategory && selectedCategory !== "") {
      filtered = filtered.filter((s) => {
        const categoryId = s.category?.id;
        const selectedCatId = parseInt(selectedCategory);
        const matches = categoryId === selectedCatId;
        return matches;
      });
    }

    // Step 3: Filter by service name (if provided)
    if (serviceName && serviceName.trim() !== "") {
      filtered = filtered.filter((s) =>
        s.name && s.name.toLowerCase().includes(serviceName.toLowerCase())
      );
    }

    // Step 4: Filter by provider (only if explicitly set from search results)
    if (filterByProviderId) {
      filtered = filtered.filter((s) =>
        s.provider?.id === parseInt(filterByProviderId)
      );
    }

    setServices(filtered);
    setInactiveServices([]);
  }, [allServices, selectedCategory, city, serviceName, filterByProviderId]);

  // Apply filters when allServices loads or when filter inputs change
  useEffect(() => {
    if (allServices.length > 0) {
      applyFilters();
    }
  }, [selectedCategory, city, serviceName, allServices, filterByProviderId, applyFilters]);

  const handleBooking = async () => {
    if (!bookingDetails.date || !bookingDetails.time || !selectedService) {
      alert("Please fill all details");
      return;
    }

    const selectedDate = new Date(bookingDetails.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert("Please select a future date for the booking");
      return;
    }

    const role = localStorage.getItem("role");
    const currentUserId = localStorage.getItem("customerId") || localStorage.getItem("providerId") || localStorage.getItem("adminId");

    if (!currentUserId) {
      alert("User ID not found. Please login again.");
      return;
    }

    const userIdNum = parseInt(currentUserId);
    if (isNaN(userIdNum) || userIdNum <= 0) {
      alert("Invalid user ID. Please login again.");
      return;
    }

    const providerId = selectedService.provider?.id || selectedService.providerId;
    if (!providerId) {
      alert("Service provider information is missing. Please select another service.");
      return;
    }

    const providerIdNum = parseInt(providerId);
    if (isNaN(providerIdNum) || providerIdNum <= 0) {
      alert("Invalid provider ID. Please select another service.");
      return;
    }

    const serviceId = selectedService.id || selectedService.serviceId;
    if (!serviceId) {
      alert("Service ID not found. Please select another service.");
      return;
    }

    const serviceIdNum = parseInt(serviceId);
    if (isNaN(serviceIdNum) || serviceIdNum <= 0) {
      alert("Invalid service ID. Please select another service.");
      return;
    }

    if (!selectedService.name || selectedService.name.trim() === "") {
      alert("Service name is missing. Please select another service.");
      return;
    }

    try {
      const booking = {
        providerId: providerIdNum,
        serviceId: serviceIdNum,
        serviceName: selectedService.name,
        bookingDate: bookingDetails.date,
        bookingTime: bookingDetails.time,
        status: "Pending",
        notes: "",
        totalAmount: selectedService.price || 0
      };

      if (role === "provider") {
        booking.providerBookerId = userIdNum;
      } else {
        booking.customerId = userIdNum;
      }

      await axios.post("http://localhost:8080/booking/create", booking);
      alert("Booking Successful!");
      localStorage.removeItem("selectedProviderId");

      let redirectPath = "/customer-bookings";
      if (role === "provider") {
        redirectPath = "/provider-bookings";
      } else if (role === "admin") {
        redirectPath = "/admin-dashboard";
      }
      navigate(redirectPath);
    } catch (err) {
      const errorMsg = err.response?.data || err.message;
      alert("Booking failed: " + (typeof errorMsg === 'string' ? errorMsg : errorMsg.error || JSON.stringify(errorMsg)));
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchCategories();
      await fetchAllServices();
    } catch {
      setError("Failed to refresh services");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-container">
      <div className="book-header">
        <h2>Book a Service</h2>
        <p>Find trusted professionals and schedule your appointment</p>
      </div>

      {/* Search Context Breadcrumb */}
      {(searchContext.service || searchContext.area || searchContext.city) && (
        <div className="search-context-breadcrumb">
          <button
            className="back-to-search-btn"
            onClick={() => navigate("/search")}
          >
            <FaArrowLeft /> Back to Search
          </button>
          <div className="context-info">
            <span className="context-label">You searched for:</span>
            {searchContext.service && <span className="context-tag">{searchContext.service}</span>}
            {searchContext.area && <span className="context-tag">{searchContext.area}</span>}
            {searchContext.city && <span className="context-tag">{searchContext.city}</span>}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <p>Loading services...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
          {/* Search Inputs with Searchable Dropdowns */}
          <div className="book-search-container">
            <div className="book-search">
              {/* Category Dropdown with Search */}
              <div className="dropdown-field" style={{ position: 'relative', minWidth: '200px' }}>
                <input
                  type="text"
                  placeholder="Search Category..."
                  value={showCategoryDropdown ? categorySearch : selectedCategoryName}
                  onChange={(e) => {
                    setCategorySearch(e.target.value);
                    setShowCategoryDropdown(true);
                  }}
                  onFocus={() => {
                    setShowCategoryDropdown(true);
                    setCategorySearch("");
                  }}
                  onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 150)}
                  className="category-dropdown"
                  style={{ width: '100%', padding: '8px' }}
                  title="Search and select category"
                />
                {showCategoryDropdown && (
                  <div className="dropdown-menu">
                    <div
                      className="dropdown-item"
                      onMouseDown={() => {
                        handleCategoryChange("", "All Categories");
                      }}
                      style={{ fontWeight: selectedCategory === "" ? "600" : "500" }}
                    >
                      All Categories
                    </div>
                    {getAvailableCategories()
                      .filter((cat) =>
                        cat.name.toLowerCase().includes(categorySearch.toLowerCase())
                      )
                      .map((cat) => (
                        <div
                          key={cat.id}
                          className="dropdown-item"
                          onMouseDown={() => {
                            handleCategoryChange(cat.id.toString(), cat.name);
                          }}
                          style={{ fontWeight: selectedCategory === cat.id.toString() ? "600" : "500" }}
                        >
                          {cat.name}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Service Name Dropdown with Search */}
              <div className="dropdown-field" style={{ position: 'relative', minWidth: '200px' }}>
                <input
                  type="text"
                  placeholder="Search Service..."
                  value={showServiceDropdown ? serviceSearch : serviceName}
                  onChange={(e) => {
                    setServiceSearch(e.target.value);
                    setShowServiceDropdown(true);
                  }}
                  onFocus={() => {
                    setShowServiceDropdown(true);
                    setServiceSearch("");
                  }}
                  onBlur={() => setTimeout(() => setShowServiceDropdown(false), 150)}
                  className="category-dropdown"
                  style={{ width: '100%', padding: '8px' }}
                  title="Search and select service"
                />
                {showServiceDropdown && (
                  <div className="dropdown-menu">
                    <div
                      className="dropdown-item"
                      onMouseDown={() => {
                        handleServiceChange("");
                      }}
                      style={{ fontWeight: serviceName === "" ? "600" : "500" }}
                    >
                      All Services
                    </div>
                    {getAvailableServiceNames()
                      .filter((svc) =>
                        svc.toLowerCase().includes(serviceSearch.toLowerCase())
                      )
                      .map((svc) => (
                        <div
                          key={svc}
                          className="dropdown-item"
                          onMouseDown={() => {
                            handleServiceChange(svc);
                          }}
                          style={{ fontWeight: serviceName === svc ? "600" : "500" }}
                        >
                          {svc}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* City Dropdown with Search */}
              <div className="dropdown-field" style={{ position: 'relative', minWidth: '200px' }}>
                <input
                  type="text"
                  placeholder="Search City..."
                  value={showCityDropdown ? citySearch : city}
                  onChange={(e) => {
                    setCitySearch(e.target.value);
                    setShowCityDropdown(true);
                  }}
                  onFocus={() => {
                    setShowCityDropdown(true);
                    setCitySearch("");
                  }}
                  onBlur={() => setTimeout(() => setShowCityDropdown(false), 150)}
                  className="category-dropdown"
                  style={{ width: '100%', padding: '8px' }}
                  title="Search and select city"
                />
                {showCityDropdown && (
                  <div className="dropdown-menu">
                    <div
                      className="dropdown-item"
                      onMouseDown={() => {
                        handleCityChange("");
                      }}
                      style={{ fontWeight: city === "" ? "600" : "500" }}
                    >
                      All Cities
                    </div>
                    {getAvailableCities()
                      .filter((c) =>
                        c.toLowerCase().includes(citySearch.toLowerCase())
                      )
                      .map((c) => (
                        <div
                          key={c}
                          className="dropdown-item"
                          onMouseDown={() => {
                            handleCityChange(c);
                          }}
                          style={{ fontWeight: city === c ? "600" : "500" }}
                        >
                          {c}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="filter-search-btn"
                onClick={() => {
                  applyFilters();
                }}
                title="Click to search with filters"
              >
                Filter Services
              </button>
            </div>
          </div>

          {/* Active Services List */}
          <div className="services-header">
            <h3>Active Service Providers ({services.length})</h3>
          </div>

          <div className="services-grid">
            {services.length > 0 ? (
              services.map((service) => (
                <div
                  className={`service-card ${selectedService?.id === service.id ? "selected" : ""
                    }`}
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                >
                  <div className="service-header">
                    <h4>{service.name}</h4>
                    <span className="category-badge">{service.category?.name}</span>
                    {service.provider?.verified && <span className="verified-badge">✓ Verified</span>}
                  </div>

                  <p className="service-description">{service.description}</p>

                  <div className="service-details">
                    <p className="location">
                      📍 {service.city}, {service.state}
                    </p>
                    <p className="price">
                      <FaRupeeSign /> {service.price}
                    </p>
                  </div>

                  <div className="service-rating">
                    <FaStar color="#FFD700" /> {service.rating?.toFixed(1) || "N/A"}
                    ({service.reviewCount || 0} reviews)
                  </div>

                  <div className="provider-info-section">
                    <div className="provider-header-card">
                      {service.provider?.profileImage ? (
                        <img src={service.provider.profileImage} alt={service.provider.name} className="provider-avatar-small" />
                      ) : (
                        <div className="provider-avatar-placeholder">
                          <FaUserTie />
                        </div>
                      )}
                      <strong>{service.provider?.name}</strong>
                    </div>

                    <div className="provider-contact">
                      {service.provider?.phone && (
                        <div className="contact-item">
                          <FaPhone className="contact-icon" />
                          <span>{service.provider.phone}</span>
                        </div>
                      )}
                      {service.provider?.email && (
                        <div className="contact-item">
                          <FaEnvelope className="contact-icon" />
                          <span>{service.provider.email}</span>
                        </div>
                      )}
                      {service.city && (
                        <div className="contact-item">
                          <FaMapMarkerAlt className="contact-icon" />
                          <span>{service.city}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    className="book-now-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedService(service);
                      setTimeout(() => {
                        document.querySelector('.booking-box')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    Book Now
                  </button>
                </div>
              ))
            ) : (
              <p className="no-services">No active services found.</p>
            )}
          </div>

          {/* Inactive Service Providers Section */}
          {inactiveServices.length > 0 && (
            <div className="inactive-services-section">
              <div className="inactive-header">
                <h3>📋 Inactive Service Providers ({inactiveServices.length})</h3>
                <p className="inactive-note">These providers are currently inactive or unverified. Contact them for availability.</p>
              </div>

              <div className="services-grid">
                {inactiveServices.map((service) => (
                  <div
                    className={`service-card inactive-service-card ${selectedService?.id === service.id ? "selected" : ""
                      }`}
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                  >
                    <div className="service-header">
                      <h4>{service.name}</h4>
                      <span className="category-badge">{service.category?.name}</span>
                      <span className="inactive-badge">⚠ Inactive</span>
                    </div>

                    <p className="service-description">{service.description}</p>

                    <div className="service-details">
                      <p className="location">
                        📍 {service.city}, {service.state}
                      </p>
                      <p className="price">
                        <FaRupeeSign /> {service.price}
                      </p>
                    </div>

                    <div className="service-rating">
                      <FaStar color="#FFD700" /> {service.rating?.toFixed(1) || "N/A"}
                      ({service.reviewCount || 0} reviews)
                    </div>

                    <div className="provider-info-section">
                      <div className="provider-header-card">
                        {service.provider?.profileImage ? (
                          <img src={service.provider.profileImage} alt={service.provider.name} className="provider-avatar-small" />
                        ) : (
                          <div className="provider-avatar-placeholder">
                            <FaUserTie />
                          </div>
                        )}
                        <strong>{service.provider?.name}</strong>
                      </div>

                      <div className="provider-contact">
                        {service.provider?.phone && (
                          <div className="contact-item">
                            <FaPhone className="contact-icon" />
                            <span>{service.provider.phone}</span>
                          </div>
                        )}
                        {service.provider?.email && (
                          <div className="contact-item">
                            <FaEnvelope className="contact-icon" />
                            <span>{service.provider.email}</span>
                          </div>
                        )}
                        {service.city && (
                          <div className="contact-item">
                            <FaMapMarkerAlt className="contact-icon" />
                            <span>{service.city}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      className="book-now-btn inactive-book-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedService(service);
                        setTimeout(() => {
                          document.querySelector('.booking-box')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      disabled
                      title="This provider is inactive"
                    >
                      Provider Inactive
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {services.length === 0 && inactiveServices.length === 0 && (
            <p className="no-services">No services found. Try different filters or search terms.</p>
          )}

          {/* No Provider Warning */}
          {selectedService && !selectedService.provider && (
            <div className="error-state">
              <p>This service does not have provider information. Please select another service.</p>
            </div>
          )}

          {/* Booking Form */}
          {selectedService && selectedService.provider && (
            <div className="booking-box">
              <h3>Confirm Booking - {selectedService.name}</h3>

              <div className="booking-provider-section">
                <h4>Provider Details</h4>
                <div className="booking-provider-card">
                  <div className="provider-name-box">
                    {selectedService.provider?.profileImage ? (
                      <img src={selectedService.provider.profileImage} alt={selectedService.provider.name} className="provider-avatar-medium" />
                    ) : (
                      <div className="provider-avatar-placeholder-medium">
                        <FaUserTie />
                      </div>
                    )}
                    <strong>{selectedService.provider?.name}</strong>
                  </div>

                  <div className="booking-provider-contacts">
                    {selectedService.provider?.phone && (
                      <div className="booking-contact-item">
                        <FaPhone className="contact-icon" />
                        <div>
                          <label>Phone</label>
                          <p>{selectedService.provider.phone}</p>
                        </div>
                      </div>
                    )}
                    {selectedService.provider?.email && (
                      <div className="booking-contact-item">
                        <FaEnvelope className="contact-icon" />
                        <div>
                          <label>Email</label>
                          <p>{selectedService.provider.email}</p>
                        </div>
                      </div>
                    )}
                    {selectedService.addressLine && (
                      <div className="booking-contact-item">
                        <FaMapMarkerAlt className="contact-icon" />
                        <div>
                          <label>Address</label>
                          <p>{selectedService.addressLine || selectedService.city}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <label>
                <FaCalendarAlt /> Select Date:
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingDetails.date}
                  onChange={(e) =>
                    setBookingDetails({ ...bookingDetails, date: e.target.value })
                  }
                />
              </label>

              <label>
                <FaClock /> Select Time:
                <input
                  type="time"
                  value={bookingDetails.time}
                  onChange={(e) =>
                    setBookingDetails({ ...bookingDetails, time: e.target.value })
                  }
                />
              </label>

              {/* Customer Reviews Section - Amazon Style */}
              <div className="reviews-section">
                <h4><FaStar style={{ color: '#FFD700' }} /> Customer Reviews ({reviews.length})</h4>

                {loadingReviews && <p>Loading reviews...</p>}

                {!loadingReviews && reviews.length === 0 && (
                  <p className="no-reviews">No reviews yet. Be the first to review!</p>
                )}

                {!loadingReviews && reviews.length > 0 && (
                  <div className="reviews-list">
                    {reviews.map((review, index) => (
                      <div className="review-card" key={review.id || index}>
                        <div className="review-header">
                          <div className="review-customer">
                            <FaUserTie className="review-avatar" />
                            <strong>{review.customerName || 'Anonymous'}</strong>
                          </div>
                          <div className="review-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                style={{ color: star <= review.stars ? '#FFD700' : '#ddd' }}
                              >
                                ★
                              </span>
                            ))}
                            <span className="rating-text">{review.stars}/5</span>
                          </div>
                        </div>
                        <p className="review-comment">{review.review || 'No comment provided.'}</p>
                        <span className="review-date">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button className="confirm-btn" onClick={handleBooking}>
                Confirm Booking
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
