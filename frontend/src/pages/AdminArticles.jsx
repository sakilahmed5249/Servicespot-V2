import React, { useState, useEffect } from "react";
import "./AdminArticles.css";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    image: "",
    author: "",
    category: "",
    isPublished: false,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/articles");
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setMessage("Error loading articles");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.author) {
      setMessage("Please fill in all required fields");
      return;
    }

    try {
      const url = editingId
        ? `http://localhost:8080/api/articles/${editingId}`
        : "http://localhost:8080/api/articles";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage(editingId ? "Article updated successfully!" : "Article created successfully!");
        setFormData({
          title: "",
          content: "",
          excerpt: "",
          image: "",
          author: "",
          category: "",
          isPublished: false,
        });
        setEditingId(null);
        setShowForm(false);
        fetchArticles();
      } else {
        setMessage("Error saving article");
      }
    } catch (error) {
      console.error("Error saving article:", error);
      setMessage("Error saving article");
    }
  };

  const handleEdit = (article) => {
    setFormData(article);
    setEditingId(article.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/articles/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage("Article deleted successfully!");
        fetchArticles();
      } else {
        setMessage("Error deleting article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      setMessage("Error deleting article");
    }
  };

  const handlePublish = async (id, isPublished) => {
    try {
      const url = isPublished
        ? `http://localhost:8080/api/articles/${id}/unpublish`
        : `http://localhost:8080/api/articles/${id}/publish`;

      const response = await fetch(url, { method: "PUT" });

      if (response.ok) {
        setMessage(isPublished ? "Article unpublished!" : "Article published!");
        fetchArticles();
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
      setMessage("Error updating article");
    }
  };

  return (
    <div className="admin-articles-container">
      <div className="admin-header">
        <h1>Manage Articles</h1>
        <button
          className="add-btn"
          onClick={() => {
            setShowForm(!showForm);
            if (editingId) {
              setEditingId(null);
              setFormData({
                title: "",
                content: "",
                excerpt: "",
                image: "",
                author: "",
                category: "",
                isPublished: false,
              });
            }
          }}
        >
          {showForm ? "Cancel" : "+ Add Article"}
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes("successfully") ? "success" : "error"}`}>
          {message}
        </div>
      )}

      {showForm && (
        <form className="article-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Excerpt</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows="2"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows="6"
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Author *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="publish"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleInputChange}
            />
            <label htmlFor="publish">Publish Article</label>
          </div>

          <button type="submit" className="submit-btn">
            {editingId ? "Update Article" : "Create Article"}
          </button>
        </form>
      )}

      <div className="articles-table">
        {loading ? (
          <p>Loading articles...</p>
        ) : articles.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>{article.title}</td>
                  <td>{article.author}</td>
                  <td>{article.category || "-"}</td>
                  <td>
                    <span className={`status ${article.isPublished ? "published" : "draft"}`}>
                      {article.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="toggle-btn"
                      onClick={() => handlePublish(article.id, article.isPublished)}
                      title={article.isPublished ? "Unpublish" : "Publish"}
                    >
                      {article.isPublished ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(article)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(article.id)}
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
          <p>No articles found</p>
        )}
      </div>
    </div>
  );
}
