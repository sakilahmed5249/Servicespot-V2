import React, { useEffect, useState } from "react";
import "./AdminCustomers.css";
import { FaSearch, FaCheckCircle, FaTimesCircle, FaShieldAlt } from "react-icons/fa";
import axios from "axios";

export default function AdminCustomers() {

  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/customers");
      setCustomers(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleSearch = (value) => {
    const searchText = value.toLowerCase();
    const result = customers.filter(c =>
      c.name.toLowerCase().includes(searchText) ||
      c.email.toLowerCase().includes(searchText) ||
      c.phone.includes(searchText) ||
      c.city.toLowerCase().includes(searchText)
    );
    setFiltered(result);
  };

  const promoteToAdmin = async (id) => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:8080/api/admin/customer/${id}/promote-admin`);
      alert("Customer promoted to admin");
      fetchCustomers();
    } catch (error) {
      console.error("Error promoting customer:", error);
      alert("Error promoting customer");
    } finally {
      setLoading(false);
    }
  };

  const demoteFromAdmin = async (id) => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:8080/api/admin/customer/${id}/demote-admin`);
      alert("Admin demoted to customer");
      fetchCustomers();
    } catch (error) {
      console.error("Error demoting admin:", error);
      alert("Error demoting admin");
    } finally {
      setLoading(false);
    }
  };

  const verifyCustomerProfile = async (id) => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:8080/api/admin/customer/${id}/verify`);
      alert("Customer verified");
      fetchCustomers();
    } catch (error) {
      console.error("Error verifying customer:", error);
      alert("Error verifying customer");
    } finally {
      setLoading(false);
    }
  };

  const unverifyCustomerProfile = async (id) => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:8080/api/admin/customer/${id}/unverify`);
      alert("Customer unverified");
      fetchCustomers();
    } catch (error) {
      console.error("Error unverifying customer:", error);
      alert("Error unverifying customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-customers-container">
      <h1>Customers Management</h1>

      {/* Search Box */}
      <div className="customer-search-box">
        <FaSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Search customers..." 
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Customers Table */}
      <table className="customer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>City</th>
            <th>Role</th>
            <th>Verified</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No Customers Found
              </td>
            </tr>
          ) : (
            filtered.map((c, index) => (
              <tr key={index}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.city}</td>

                <td>
                  <span style={{
                    padding: "5px 10px",
                    borderRadius: "4px",
                    backgroundColor: c.role === "ADMIN" ? "#ffc107" : "#e9ecef",
                    fontWeight: "bold",
                    fontSize: "12px"
                  }}>
                    {c.role || "CUSTOMER"}
                  </span>
                </td>

                <td>
                  {c.verified ? (
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
                  {c.role === "ADMIN" ? (
                    <button 
                      onClick={() => demoteFromAdmin(c.id)}
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
                      onClick={() => promoteToAdmin(c.id)}
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
                  
                  {c.verified ? (
                    <button 
                      onClick={() => unverifyCustomerProfile(c.id)}
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
                      onClick={() => verifyCustomerProfile(c.id)}
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
