import React, { useState, useEffect } from "react";
import "./AdminFAQ.css";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    displayOrder: 0,
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/faq");
      const data = await response.json();
      setFaqs(data);
      
      const uniqueCategories = [...new Set(data.map((faq) => faq.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setMessage("Error loading FAQs");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : name === "displayOrder" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.question || !formData.answer) {
      setMessage("Please fill in all required fields");
      return;
    }

    try {
      const url = editingId
        ? `http://localhost:8080/api/faq/${editingId}`
        : "http://localhost:8080/api/faq";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage(editingId ? "FAQ updated successfully!" : "FAQ created successfully!");
        setFormData({
          question: "",
          answer: "",
          category: "",
          displayOrder: 0,
          isActive: true,
        });
        setEditingId(null);
        setShowForm(false);
        fetchFAQs();
      } else {
        setMessage("Error saving FAQ");
      }
    } catch (error) {
      console.error("Error saving FAQ:", error);
      setMessage("Error saving FAQ");
    }
  };

  const handleEdit = (faq) => {
    setFormData(faq);
    setEditingId(faq.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/faq/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage("FAQ deleted successfully!");
        fetchFAQs();
      } else {
        setMessage("Error deleting FAQ");
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      setMessage("Error deleting FAQ");
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      const url = isActive
        ? `http://localhost:8080/api/faq/${id}/deactivate`
        : `http://localhost:8080/api/faq/${id}/activate`;

      const response = await fetch(url, { method: "PUT" });

      if (response.ok) {
        setMessage(isActive ? "FAQ deactivated!" : "FAQ activated!");
        fetchFAQs();
      }
    } catch (error) {
      console.error("Error toggling active status:", error);
      setMessage("Error updating FAQ");
    }
  };

  return (
    <div className="admin-faq-container">
      <div className="admin-header">
        <h1>Manage FAQs</h1>
        <button
          className="add-btn"
          onClick={() => {
            setShowForm(!showForm);
            if (editingId) {
              setEditingId(null);
              setFormData({
                question: "",
                answer: "",
                category: "",
                displayOrder: 0,
                isActive: true,
              });
            }
          }}
        >
          {showForm ? "Cancel" : "+ Add FAQ"}
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes("successfully") ? "success" : "error"}`}>
          {message}
        </div>
      )}

      {showForm && (
        <form className="faq-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Question *</label>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Answer *</label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., General, Services, etc."
              />
            </div>

            <div className="form-group">
              <label>Display Order</label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="active"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
            <label htmlFor="active">Active</label>
          </div>

          <button type="submit" className="submit-btn">
            {editingId ? "Update FAQ" : "Create FAQ"}
          </button>
        </form>
      )}

      <div className="faqs-table">
        {loading ? (
          <p>Loading FAQs...</p>
        ) : faqs.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Category</th>
                <th>Status</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq) => (
                <tr key={faq.id}>
                  <td>{faq.question}</td>
                  <td>{faq.category || "-"}</td>
                  <td>
                    <span className={`status ${faq.isActive ? "active" : "inactive"}`}>
                      {faq.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{faq.displayOrder}</td>
                  <td className="actions">
                    <button
                      className="toggle-btn"
                      onClick={() => handleToggleActive(faq.id, faq.isActive)}
                      title={faq.isActive ? "Deactivate" : "Activate"}
                    >
                      {faq.isActive ? <FaCheck /> : <FaTimes />}
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(faq)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(faq.id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No FAQs found</p>
        )}
      </div>
    </div>
  );
}
