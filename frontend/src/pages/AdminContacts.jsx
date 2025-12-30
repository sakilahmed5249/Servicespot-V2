import React, { useState, useEffect } from "react";
import "./AdminContacts.css";
import { FaCheck, FaTrash, FaEnvelope, FaPhone } from "react-icons/fa";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [filterStatus, setFilterStatus] = useState("unresolved");
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts(filterStatus);
  }, [contacts, filterStatus]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/contact");
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setMessage("Error loading contacts");
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = (status) => {
    let filtered = contacts;
    if (status === "unresolved") {
      filtered = contacts.filter((c) => !c.isResolved);
    } else if (status === "resolved") {
      filtered = contacts.filter((c) => c.isResolved);
    }
    setFilteredContacts(filtered);
  };

  const handleResolve = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/contact/${id}/resolve`, {
        method: "PUT",
      });

      if (response.ok) {
        setMessage("Contact marked as resolved!");
        fetchContacts();
        setSelectedContact(null);
      }
    } catch (error) {
      console.error("Error resolving contact:", error);
      setMessage("Error updating contact");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/contact/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage("Contact deleted successfully!");
        fetchContacts();
        setSelectedContact(null);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      setMessage("Error deleting contact");
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

  if (selectedContact) {
    return (
      <div className="contact-detail-container">
        <button className="back-btn" onClick={() => setSelectedContact(null)}>
          ← Back to Contacts
        </button>

        {message && (
          <div className={`message ${message.includes("success") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <div className="contact-detail">
          <div className="detail-header">
            <h2>{selectedContact.subject}</h2>
            <div className="detail-meta">
              <span className="status-badge" style={{
                background: selectedContact.isResolved ? "#d4edda" : "#fff3cd",
                color: selectedContact.isResolved ? "#155724" : "#856404"
              }}>
                {selectedContact.isResolved ? "Resolved" : "Unresolved"}
              </span>
              <span className="date">{formatDate(selectedContact.createdAt)}</span>
            </div>
          </div>

          <div className="detail-info">
            <div className="info-group">
              <label>From:</label>
              <p>{selectedContact.name}</p>
            </div>

            <div className="info-group">
              <label><FaEnvelope /> Email:</label>
              <p><a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a></p>
            </div>

            {selectedContact.phone && (
              <div className="info-group">
                <label><FaPhone /> Phone:</label>
                <p><a href={`tel:${selectedContact.phone}`}>{selectedContact.phone}</a></p>
              </div>
            )}
          </div>

          <div className="message-content">
            <h3>Message:</h3>
            <p>{selectedContact.message}</p>
          </div>

          <div className="detail-actions">
            {!selectedContact.isResolved && (
              <button
                className="resolve-btn"
                onClick={() => handleResolve(selectedContact.id)}
              >
                <FaCheck /> Mark as Resolved
              </button>
            )}
            <button
              className="delete-btn"
              onClick={() => handleDelete(selectedContact.id)}
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-contacts-container">
      <div className="admin-header">
        <h1>Contact Messages</h1>
        <div className="filter-group">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Messages</option>
            <option value="unresolved">Unresolved</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes("success") ? "success" : "error"}`}>
          {message}
        </div>
      )}

      <div className="contacts-list">
        {loading ? (
          <p>Loading contacts...</p>
        ) : filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="contact-card"
              onClick={() => setSelectedContact(contact)}
            >
              <div className="card-header">
                <h3>{contact.subject}</h3>
                <span className={`status ${contact.isResolved ? "resolved" : "unresolved"}`}>
                  {contact.isResolved ? "Resolved" : "Unresolved"}
                </span>
              </div>

              <div className="card-content">
                <p className="sender">From: <strong>{contact.name}</strong></p>
                <p className="email">Email: {contact.email}</p>
                {contact.phone && <p className="phone">Phone: {contact.phone}</p>}
                <p className="preview">{contact.message.substring(0, 100)}...</p>
              </div>

              <div className="card-footer">
                <span className="date">{formatDate(contact.createdAt)}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No contacts found</p>
        )}
      </div>
    </div>
  );
}
