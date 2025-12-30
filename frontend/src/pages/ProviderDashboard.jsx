import React, { useEffect, useState } from "react";
import "./ProviderDashboard.css";
import "./ProviderProfile.css";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaStar, FaSignOutAlt, FaCalendarAlt, FaClock, FaUserTie, FaUserCircle } from "react-icons/fa";
import axios from "axios";

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const providerId = localStorage.getItem("providerId");
  
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    city: "",
    state: "",
    pincode: ""
  });
  
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: ""
  });

  const fetchProviderData = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/provider/${providerId}`);
      setProvider(res.data);

      const servicesRes = await axios.get(
        `http://localhost:8080/api/services/provider/${providerId}`
      );
      setServices(servicesRes.data);
      
      const bookingsRes = await axios.get(
        `http://localhost:8080/booking/provider/${providerId}`
      );
      setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data.slice(0, 5) : []);
      
      const myBookingsRes = await axios.get(
        `http://localhost:8080/booking/provider-made/${providerId}`
      );
      setMyBookings(Array.isArray(myBookingsRes.data) ? myBookingsRes.data : []);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching provider data:", error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/category");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!newCategory.name.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      const categoryData = {
        name: newCategory.name,
        description: newCategory.description || ""
      };

      const res = await axios.post("http://localhost:8080/api/category", categoryData);
      alert("Category created successfully!");
      setCategories([...categories, res.data]);
      setNewCategory({ name: "", description: "" });
      setShowNewCategoryForm(false);
      setNewService({ ...newService, categoryId: res.data.id });
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category: " + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("loggedIn") || localStorage.getItem("role") !== "provider") {
      navigate("/login-provider");
      return;
    }

    if (!providerId) {
      alert("Provider ID not found");
      navigate("/login-provider");
      return;
    }

    fetchProviderData();
    fetchCategories();
  }, [providerId, navigate]);

  const handleAddService = async (e) => {
    e.preventDefault();

    if (!newService.name || !newService.description || !newService.categoryId || 
        !newService.price || !newService.city || !newService.state || !newService.pincode) {
      alert("Please fill all fields");
      return;
    }

    try {
      const serviceData = {
        name: newService.name,
        description: newService.description,
        category: { id: parseInt(newService.categoryId) },
        provider: { id: parseInt(providerId) },
        price: parseFloat(newService.price),
        city: newService.city,
        state: newService.state,
        pincode: parseInt(newService.pincode),
        isActive: true
      };

      await axios.post("http://localhost:8080/api/services", serviceData);
      alert("Service added successfully!");
      setNewService({
        name: "",
        description: "",
        categoryId: "",
        price: "",
        city: "",
        state: "",
        pincode: ""
      });
      setShowAddServiceForm(false);
      fetchProviderData();
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Failed to add service: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        console.log("Deleting service:", serviceId);
        const response = await axios.delete(`http://localhost:8080/api/services/${serviceId}`);
        console.log("Delete response:", response.data);
        alert("Service deleted successfully!");
        fetchProviderData();
      } catch (error) {
        console.error("Error deleting service:", error);
        const errorMsg = error.response?.data || error.message;
        alert("Failed to delete service: " + (typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)));
      }
    }
  };

  const handleEditClick = (service) => {
    setEditingService(service.id);
    setEditFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      city: service.city,
      state: service.state,
      pincode: service.pincode
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editFormData.name || !editFormData.description || !editFormData.price) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const service = services.find(s => s.id === editingService);
      const updateData = {
        name: editFormData.name,
        description: editFormData.description,
        price: parseFloat(editFormData.price),
        city: editFormData.city,
        state: editFormData.state,
        pincode: parseInt(editFormData.pincode),
        category: { id: service.category?.id },
        provider: { id: providerId },
        isActive: service.isActive
      };
      
      await axios.put(`http://localhost:8080/api/services/${editingService}`, updateData);
      alert("Service updated successfully!");
      setEditingService(null);
      fetchProviderData();
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Failed to update service: " + (error.response?.data || error.message));
    }
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    setEditFormData({
      name: "",
      description: "",
      price: "",
      city: "",
      state: "",
      pincode: ""
    });
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      await axios.put(`http://localhost:8080/booking/${bookingId}`, {
        status: "Accepted"
      });
      alert("Booking Accepted!");
      fetchProviderData();
    } catch (error) {
      console.error("Error accepting booking:", error);
      alert("Failed to accept booking");
    }
  };

  const handleRejectBooking = async (bookingId) => {
    const confirm = window.confirm("Are you sure you want to reject this booking?");
    if (!confirm) return;

    try {
      await axios.put(`http://localhost:8080/booking/cancel/${bookingId}`);
      alert("Booking Rejected!");
      fetchProviderData();
    } catch (error) {
      console.error("Error rejecting booking:", error);
      alert("Failed to reject booking");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("providerId");
    navigate("/login-provider");
  };

  if (loading) {
    return <div className="dashboard-loading">Loading Dashboard...</div>;
  }

  if (!provider) {
    return <div className="dashboard-error">Failed to load provider data</div>;
  }

  return (
    <div className="provider-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Provider Dashboard</h1>
          <p>Manage your services and profile</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Provider Info Card */}
      <div className="provider-info-card">
        <div className="provider-profile-section">
          <div className="provider-image-area">
            {provider.profileImage ? (
              <img src={provider.profileImage} alt="Profile" className="provider-profile-img" onError={(e) => {
                e.target.style.display = 'none';
              }} />
            ) : (
              <FaUserTie size={40} color="#0A4D68" />
            )}
          </div>
          <div className="info-content">
            <h2>{provider.name}</h2>
            <div className="info-col-1">
              <p className="email"><strong>Email:</strong> {provider.email}</p>
              <p className="price"><strong>Price:</strong> ₹{provider.price}</p>
            </div>
            <div className="info-col-2">
              <p className="phone"><strong>Phone:</strong> 📱 {provider.phone}</p>
              <p className="location"><strong>Location:</strong> 📍 {provider.city}, {provider.state} - {provider.pincode}</p>
            </div>
            <div className="info-col-3">
              <div className="verification-status">
                {provider.verified ? (
                  <span className="verified">✓ Verified Provider</span>
                ) : (
                  <span className="unverified">✗ Not Verified</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Requests Section */}
      <div className="booking-requests-section">
        <div className="section-header">
          <h2>Recent Booking Requests ({bookings.length})</h2>
          <button 
            className="view-all-btn"
            onClick={() => navigate("/provider-bookings")}
          >
            View All Requests →
          </button>
        </div>

        {bookings.length > 0 ? (
          <div className="bookings-preview">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-preview-card">
                <div className="customer-profile-header">
                  <div className="customer-avatar">
                    {booking.customerProfileImage || booking.providerBookerProfileImage ? (
                      <img src={booking.customerProfileImage || booking.providerBookerProfileImage} alt="Customer" className="customer-profile-img" onError={(e) => {
                        e.target.style.display = 'none';
                      }} />
                    ) : (
                      <FaUserCircle size={50} color="#0A4D68" />
                    )}
                  </div>
                  <div className="customer-details">
                    <p className="customer-name"><strong>{booking.customerName || booking.providerBookerName || "Customer"}</strong></p>
                    {(booking.customerPhone || booking.providerBookerPhone) && <p className="customer-phone">📱 {booking.customerPhone || booking.providerBookerPhone}</p>}
                  </div>
                </div>
                <div className="booking-info">
                  <p className="service-name"><strong>{booking.serviceName}</strong></p>
                  <p><FaCalendarAlt /> {booking.date}</p>
                  <p><FaClock /> {booking.time}</p>
                </div>
                <div className="booking-status">
                  <span className={`status-badge ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>
                {booking.status === "Pending" && (
                  <div className="booking-actions">
                    <button 
                      className="accept-mini-btn"
                      onClick={() => handleAcceptBooking(booking.id)}
                    >
                      Accept
                    </button>
                    <button 
                      className="reject-mini-btn"
                      onClick={() => handleRejectBooking(booking.id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-bookings-message">
            <p>No booking requests yet. Great services will attract customers!</p>
          </div>
        )}
      </div>

      {/* My Bookings Section (Bookings made by this provider) */}
      <div className="booking-requests-section">
        <div className="section-header">
          <h2>My Bookings ({myBookings.length})</h2>
        </div>

        {myBookings.length > 0 ? (
          <div className="bookings-preview">
            {myBookings.map((booking) => (
              <div key={booking.id} className="booking-preview-card">
                <div className="customer-profile-header">
                  <div className="customer-avatar">
                    {booking.providerProfileImage ? (
                      <img src={booking.providerProfileImage} alt="Provider" className="customer-profile-img" onError={(e) => {
                        e.target.style.display = 'none';
                      }} />
                    ) : (
                      <FaUserTie size={50} color="#0A4D68" />
                    )}
                  </div>
                  <div className="customer-details">
                    <p className="customer-name"><strong>Provider: {booking.providerName}</strong></p>
                    {booking.providerPhone && <p className="customer-phone">📱 {booking.providerPhone}</p>}
                  </div>
                </div>
                <div className="booking-info">
                  <p className="service-name"><strong>{booking.serviceName}</strong></p>
                  <p><FaCalendarAlt /> {booking.date}</p>
                  <p><FaClock /> {booking.time}</p>
                </div>
                <div className="booking-status">
                  <span className={`status-badge ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-bookings-message">
            <p>You haven't booked any services yet.</p>
          </div>
        )}
      </div>

      {/* Services Section */}
      <div className="services-section">
        <div className="section-header">
          <h2>My Services ({services.length})</h2>
          <button 
            className="add-service-btn"
            onClick={() => setShowAddServiceForm(!showAddServiceForm)}
          >
            <FaPlus /> {showAddServiceForm ? "Cancel" : "Add New Service"}
          </button>
        </div>

        {/* Add New Category Form */}
        {showNewCategoryForm && (
          <div className="modal-overlay">
            <div className="category-modal">
              <div className="modal-header">
                <h3>Create New Category</h3>
                <button 
                  className="close-btn" 
                  onClick={() => setShowNewCategoryForm(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleCreateCategory}>
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Plumbing, Electrical, etc."
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Category description (optional)"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    rows="3"
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="save-btn">Create Category</button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowNewCategoryForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Service Form */}
        {showAddServiceForm && (
          <div className="add-service-form">
            <h3>Add New Service</h3>
            <form onSubmit={handleAddService}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Service Name"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                />
                <div className="category-select-wrapper">
                  <select
                    value={newService.categoryId}
                    onChange={(e) => setNewService({ ...newService, categoryId: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="add-category-btn"
                    onClick={() => setShowNewCategoryForm(true)}
                    title="Add New Category"
                  >
                    <FaPlus /> New
                  </button>
                </div>
              </div>

              <textarea
                placeholder="Service Description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                rows="3"
              />

              <div className="form-row">
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newService.city}
                  onChange={(e) => setNewService({ ...newService, city: e.target.value })}
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  placeholder="State"
                  value={newService.state}
                  onChange={(e) => setNewService({ ...newService, state: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Pincode"
                  value={newService.pincode}
                  onChange={(e) => setNewService({ ...newService, pincode: e.target.value })}
                />
              </div>

              <button type="submit" className="submit-btn">Create Service</button>
            </form>
          </div>
        )}

        {/* Edit Service Modal */}
        {editingService && (
          <div className="modal-overlay">
            <div className="edit-service-modal">
              <div className="modal-header">
                <h3>Edit Service</h3>
                <button className="close-btn" onClick={handleCancelEdit}>✕</button>
              </div>

              <form onSubmit={handleEditSubmit} className="edit-service-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Service Name *</label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      value={editFormData.price}
                      onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    rows="4"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={editFormData.city}
                      onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={editFormData.state}
                      onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="number"
                    value={editFormData.pincode}
                    onChange={(e) => setEditFormData({ ...editFormData, pincode: e.target.value })}
                  />
                </div>

                <div className="modal-actions">
                  <button type="submit" className="save-btn">Save Changes</button>
                  <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-item">
                <div className="service-header">
                  <h4>{service.name}</h4>
                  <span className="category-tag">{service.category?.name}</span>
                </div>

                <p className="service-desc">{service.description}</p>

                <div className="service-meta">
                  <span className="price">₹{service.price}</span>
                  <span className="location">{service.city}, {service.state}</span>
                </div>

                <div className="rating">
                  <FaStar color="#FFD700" /> 
                  <span>{service.rating?.toFixed(1) || "N/A"} ({service.reviewCount || 0})</span>
                </div>

                <div className="service-actions">
                  <button className="edit-btn" onClick={() => handleEditClick(service)}>
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-services">
            <p>No services yet. Create your first service to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
