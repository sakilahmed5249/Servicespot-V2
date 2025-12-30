import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { FaUsers, FaUserShield, FaCheckCircle, FaTimesCircle, FaTools, FaEnvelope, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    customers: 0,
    providers: 0,
    services: 0,
    admins: 0,
    unsolvedMessages: 0
  });
  
  const [unsolvedMessages, setUnsolvedMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("loggedIn") || localStorage.getItem("role") !== "admin") {
      navigate("/login-admin");
      return;
    }
    
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const customersRes = await axios.get("http://localhost:8080/api/admin/customers");
      const providersRes = await axios.get("http://localhost:8080/api/admin/providers");
      const servicesRes = await axios.get("http://localhost:8080/api/admin/services");
      const contactsRes = await axios.get("http://localhost:8080/api/contact/unresolved");

      const customers = customersRes.data || [];
      const providers = providersRes.data || [];
      const services = servicesRes.data || [];
      const unresolved = contactsRes.data || [];
      
      const adminCount = customers.filter(c => c.role === "ADMIN").length + 
                        providers.filter(p => p.role === "ADMIN").length;

      setStats({
        customers: customers.length,
        providers: providers.length,
        services: services.length,
        admins: adminCount,
        unsolvedMessages: unresolved.length
      });
      setUnsolvedMessages(unresolved);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="admin-dashboard-container">
      <h1>Admin Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="dashboard-cards">
            <div className="card">
              <FaUsers size={40} color="#0A4D68" />
              <h3>{stats.customers}</h3>
              <p>Total Customers</p>
            </div>

            <div className="card">
              <FaUserShield size={40} color="#0A4D68" />
              <h3>{stats.providers}</h3>
              <p>Total Providers</p>
            </div>

            <div className="card">
              <FaTools size={40} color="#0A4D68" />
              <h3>{stats.services}</h3>
              <p>Total Services</p>
            </div>

            <div className="card">
              <FaCheckCircle size={40} color="green" />
              <h3>{stats.admins}</h3>
              <p>Total Admins</p>
            </div>

            <div className="card" style={{ backgroundColor: stats.unsolvedMessages > 0 ? "#fff3cd" : "#d4edda" }}>
              <FaEnvelope size={40} color={stats.unsolvedMessages > 0 ? "#856404" : "#155724"} />
              <h3>{stats.unsolvedMessages}</h3>
              <p>Unsolved Messages</p>
            </div>
          </div>

          <div className="admin-actions">
            <button onClick={() => navigate('/admin-customers')}>
              Manage Customers
            </button>

            <button onClick={() => navigate('/admin-providers')}>
              Manage Providers
            </button>

            <button onClick={() => navigate('/book-service')}>
              View All Services
            </button>

            <button onClick={() => navigate('/admin-contacts')} style={{ backgroundColor: "#ff9800" }}>
              Contact & Help Messages
            </button>
          </div>

          {stats.unsolvedMessages > 0 && (
            <div className="unsolved-messages-section">
              <h2>Unresolved Contact Messages ({stats.unsolvedMessages})</h2>
              <div className="messages-preview">
                {unsolvedMessages.map((message) => (
                  <div key={message.id} className="message-preview-card">
                    <div className="message-preview-header">
                      <h4>{message.subject}</h4>
                      <span className="message-date">{formatDate(message.createdAt)}</span>
                    </div>
                    <div className="message-preview-content">
                      <p className="message-sender"><strong>From:</strong> {message.name} ({message.email})</p>
                      {message.phone && <p className="message-phone"><strong>Phone:</strong> {message.phone}</p>}
                      <p className="message-text">{message.message.substring(0, 150)}...</p>
                    </div>
                    <button 
                      className="view-details-btn"
                      onClick={() => navigate('/admin-contacts')}
                    >
                      View Details <FaArrowRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
