import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CustomerBookings.css";
import { FaClock, FaCalendarAlt, FaUserTie, FaTimesCircle, FaStar } from "react-icons/fa";

export default function CustomerBookings() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingBookingId, setRatingBookingId] = useState(null);
  const [ratingData, setRatingData] = useState({ stars: 5, review: "" });
  const [submittingRating, setSubmittingRating] = useState(false);
  const customerId = localStorage.getItem("customerId");

  useEffect(() => {
    if (customerId) {
      fetchBookings();
    } else {
      setError("Customer ID not found. Please login again.");
      setLoading(false);
    }
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching bookings for customer:", customerId);
      const res = await axios.get(
        `http://localhost:8080/booking/customer/${customerId}`
      );
      console.log("Bookings received:", res.data);
      res.data.forEach((b, idx) => {
        console.log(`Booking ${idx} provider image present:`, b.providerProfileImage ? `Yes, length: ${b.providerProfileImage.length}` : "No");
      });
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to load bookings: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    const confirm = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirm) return;

    try {
      await axios.put(`http://localhost:8080/booking/cancel/${id}`);
      alert("Booking Cancelled!");
      fetchBookings();
    } catch (error) {
      console.error(error);
      alert("Failed to cancel booking!");
    }
  };

  const submitRating = async (bookingId) => {
    if (ratingData.stars < 1 || ratingData.stars > 5) {
      alert("Please select a rating between 1 and 5 stars");
      return;
    }

    if (!ratingData.review.trim()) {
      alert("Please write a review");
      return;
    }

    setSubmittingRating(true);
    try {
      await axios.post("http://localhost:8080/api/rating/create", {
        bookingId: bookingId,
        stars: ratingData.stars,
        review: ratingData.review
      });
      alert("Thank you for rating! Your review helps other customers.");
      setRatingBookingId(null);
      setRatingData({ stars: 5, review: "" });
      fetchBookings();
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating: " + (error.response?.data || error.message));
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <h1>My Bookings</h1>
        <p>Track, manage and review your service appointments</p>
      </div>

      {loading && <p className="loading-state">Loading bookings...</p>}

      {error && (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchBookings} className="retry-btn">Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div className="bookings-list">
          {bookings.length === 0 ? (
            <p className="no-bookings">No bookings found.</p>
          ) : (
          bookings.map((b) => (
            <div className="booking-card" key={b.id}>
              
              <div className="booking-header">
                <h3>{b.serviceName}</h3>
                <span className={`status ${b.status.toLowerCase()}`}>
                  {b.status}
                </span>
              </div>

              <div className="provider-info">
                {b.providerProfileImage && (
                  <img 
                    src={b.providerProfileImage} 
                    alt="Provider" 
                    className="provider-avatar" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.onerror = null;
                    }} 
                  />
                )}
                <div>
                  <p><FaUserTie /> Provider: {b.providerName || `ID: ${b.providerId}`}</p>
                </div>
              </div>
              {b.providerPhone && <p>📱 Phone: {b.providerPhone}</p>}
              {b.providerEmail && <p>✉️ Email: {b.providerEmail}</p>}
              <p><FaCalendarAlt /> Date: {b.date}</p>
              <p><FaClock /> Time: {b.time}</p>
              {b.totalAmount && <p>💰 Amount: ₹{b.totalAmount}</p>}

              {b.status === "Pending" && (
                <button 
                  className="cancel-btn" 
                  onClick={() => cancelBooking(b.id)}
                >
                  <FaTimesCircle /> Cancel Booking
                </button>
              )}

              {b.status === "Completed" && ratingBookingId !== b.id && (
                <button 
                  className="rate-btn" 
                  onClick={() => setRatingBookingId(b.id)}
                >
                  <FaStar /> Rate Service
                </button>
              )}

              {b.status === "Completed" && ratingBookingId === b.id && (
                <div className="rating-form">
                  <div className="rating-section">
                    <label>Rating:</label>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`star ${star <= ratingData.stars ? 'active' : ''}`}
                          onClick={() => setRatingData({ ...ratingData, stars: star })}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <span className="rating-text">{ratingData.stars}/5</span>
                  </div>

                  <textarea
                    className="review-textarea"
                    placeholder="Share your experience with this service..."
                    value={ratingData.review}
                    onChange={(e) => setRatingData({ ...ratingData, review: e.target.value })}
                    rows="3"
                  />

                  <div className="rating-actions">
                    <button
                      className="submit-rating-btn"
                      onClick={() => submitRating(b.id)}
                      disabled={submittingRating}
                    >
                      {submittingRating ? "Submitting..." : "Submit Rating"}
                    </button>
                    <button
                      className="cancel-rating-btn"
                      onClick={() => {
                        setRatingBookingId(null);
                        setRatingData({ stars: 5, review: "" });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        </div>
      )}
    </div>
  );
}
