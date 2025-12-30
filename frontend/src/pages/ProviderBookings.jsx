import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProviderBookings.css";
import { FaClock, FaCalendarAlt, FaUserTie, FaCheckCircle, FaTimesCircle, FaUserCircle } from "react-icons/fa";

export default function ProviderBookings() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const providerId = localStorage.getItem("providerId");

  useEffect(() => {
    if (providerId) {
      fetchBookings();
    } else {
      setError("Provider ID not found. Please login again.");
      setLoading(false);
    }
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        `http://localhost:8080/booking/provider/${providerId}`
      );
      setBookings(res.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to load booking requests: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const acceptBooking = async (id) => {
    try {
      await axios.put(`http://localhost:8080/booking/${id}`, {
        status: "Accepted"
      });
      alert("Booking Accepted!");
      fetchBookings();
    } catch (error) {
      console.error("Error accepting booking:", error);
      alert("Failed to accept booking");
    }
  };

  const rejectBooking = async (id) => {
    const confirm = window.confirm("Are you sure you want to reject this booking?");
    if (!confirm) return;

    try {
      await axios.put(`http://localhost:8080/booking/cancel/${id}`);
      alert("Booking Rejected!");
      fetchBookings();
    } catch (error) {
      console.error("Error rejecting booking:", error);
      alert("Failed to reject booking");
    }
  };

  const completeBooking = async (id) => {
    const confirm = window.confirm("Mark this booking as completed?");
    if (!confirm) return;

    try {
      await axios.put(`http://localhost:8080/booking/complete/${id}`);
      alert("Booking Completed!");
      fetchBookings();
    } catch (error) {
      console.error("Error completing booking:", error);
      alert("Failed to complete booking");
    }
  };

  return (
    <div className="provider-bookings-container">
      <div className="bookings-header">
        <h1>Booking Requests</h1>
        <p>Manage and respond to customer service requests</p>
      </div>

      {loading && <p className="loading-state">Loading booking requests...</p>}

      {error && (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchBookings} className="retry-btn">Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div className="bookings-list">
          {bookings.length === 0 ? (
            <p className="no-bookings">No booking requests yet.</p>
          ) : (
            bookings.map((booking) => (
              <div className="booking-card" key={booking.id}>
                <div className="booking-header">
                  <h3>{booking.serviceName}</h3>
                  <span className={`status ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="customer-profile-section">
                  <div className="customer-avatar">
                    {booking.customerProfileImage ? (
                      <img 
                        src={booking.customerProfileImage} 
                        alt="Customer" 
                        className="customer-profile-img" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.onerror = null;
                        }} 
                      />
                    ) : (
                      <FaUserCircle size={50} color="#0A4D68" />
                    )}
                  </div>
                  <div className="customer-info">
                    <p className="customer-name"><strong>{booking.customerName || `ID: ${booking.customerId}`}</strong></p>
                    {booking.customerPhone && <p className="customer-phone">📱 {booking.customerPhone}</p>}
                    {booking.customerEmail && <p className="customer-email">✉️ {booking.customerEmail}</p>}
                  </div>
                </div>
                <p><FaCalendarAlt /> Date: {booking.date}</p>
                <p><FaClock /> Time: {booking.time}</p>
                {booking.totalAmount && <p>💰 Amount: ₹{booking.totalAmount}</p>}
                {booking.notes && <p>📝 Notes: {booking.notes}</p>}

                <div className="action-buttons">
                  {booking.status === "Pending" && (
                    <>
                      <button 
                        className="accept-btn" 
                        onClick={() => acceptBooking(booking.id)}
                      >
                        <FaCheckCircle /> Accept
                      </button>
                      <button 
                        className="reject-btn" 
                        onClick={() => rejectBooking(booking.id)}
                      >
                        <FaTimesCircle /> Reject
                      </button>
                    </>
                  )}
                  {booking.status === "Accepted" && (
                    <button 
                      className="complete-btn" 
                      onClick={() => completeBooking(booking.id)}
                    >
                      <FaCheckCircle /> Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
