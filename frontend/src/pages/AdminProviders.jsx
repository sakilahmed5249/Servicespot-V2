import React, { useEffect, useState } from "react";
import "./AdminProviders.css";
import { FaSearch, FaCheckCircle, FaTimesCircle, FaShieldAlt } from "react-icons/fa";
import axios from "axios";

export default function AdminProviders() {

  const [providers, setProviders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/providers");
      setProviders(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  const handleSearch = (value) => {
    const text = value.toLowerCase();
    const result = providers.filter(p =>
      p.name.toLowerCase().includes(text) ||
      p.email.toLowerCase().includes(text) ||
      p.phone.includes(text) ||
      p.serviceType.toLowerCase().includes(text) ||
      p.city.toLowerCase().includes(text)
    );
    setFiltered(result);
  };

  const promoteToAdmin = async (id) => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:8080/api/admin/provider/${id}/promote-admin`);
      alert("Provider promoted to admin");
      fetchProviders();
    } catch (error) {
      console.error("Error promoting provider:", error);
      alert("Error promoting provider");
    } finally {
      setLoading(false);
    }
  };

  const demoteFromAdmin = async (id) => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:8080/api/admin/provider/${id}/demote-admin`);
      alert("Admin demoted to provider");
      fetchProviders();
    } catch (error) {
      console.error("Error demoting admin:", error);
      alert("Error demoting admin");
    } finally {
      setLoading(false);
    }
  };

  const verifyProviderProfile = async (id) => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:8080/api/admin/provider/${id}/verify`);
      alert("Provider verified");
      fetchProviders();
    } catch (error) {
      console.error("Error verifying provider:", error);
      alert("Error verifying provider");
    } finally {
      setLoading(false);
    }
  };

  const unverifyProviderProfile = async (id) => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:8080/api/admin/provider/${id}/unverify`);
      alert("Provider unverified");
      fetchProviders();
    } catch (error) {
      console.error("Error unverifying provider:", error);
      alert("Error unverifying provider");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-providers-container">
      <h1>Providers Management</h1>

      {/* Search */}
      <div className="provider-search-box">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search providers..."
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <table className="provider-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Service Type</th>
            <th>City</th>
            <th>Role</th>
            <th>Verified</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No Providers Found
              </td>
            </tr>
          ) : (
            filtered.map((p, index) => (
              <tr key={index}>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>{p.phone}</td>
                <td>{p.serviceType}</td>
                <td>{p.city}</td>

                <td>
                  <span style={{
                    padding: "5px 10px",
                    borderRadius: "4px",
                    backgroundColor: p.role === "ADMIN" ? "#ffc107" : "#e9ecef",
                    fontWeight: "bold",
                    fontSize: "12px"
                  }}>
                    {p.role || "PROVIDER"}
                  </span>
                </td>

                <td>
                  {p.verified ? (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      <FaCheckCircle /> Yes
                    </span>
                  ) : (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      <FaTimesCircle /> No
                    </span>
                  )}
                </td>

                <td style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                  {p.role === "ADMIN" ? (
                    <button 
                      onClick={() => demoteFromAdmin(p.id)}
                      disabled={loading}
                      style={{ 
                        backgroundColor: "#dc3545", 
                        color: "white", 
                        padding: "5px 10px", 
                        border: "none", 
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      <FaShieldAlt /> Demote
                    </button>
                  ) : (
                    <button 
                      onClick={() => promoteToAdmin(p.id)}
                      disabled={loading}
                      style={{ 
                        backgroundColor: "#28a745", 
                        color: "white", 
                        padding: "5px 10px", 
                        border: "none", 
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      <FaShieldAlt /> Make Admin
                    </button>
                  )}
                  
                  {p.verified ? (
                    <button 
                      onClick={() => unverifyProviderProfile(p.id)}
                      disabled={loading}
                      style={{ 
                        backgroundColor: "#ffc107", 
                        color: "black", 
                        padding: "5px 10px", 
                        border: "none", 
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      <FaTimesCircle /> Unverify
                    </button>
                  ) : (
                    <button 
                      onClick={() => verifyProviderProfile(p.id)}
                      disabled={loading}
                      style={{ 
                        backgroundColor: "#17a2b8", 
                        color: "white", 
                        padding: "5px 10px", 
                        border: "none", 
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      <FaCheckCircle /> Verify
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}
