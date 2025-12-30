import React, { useState, useEffect } from "react";
import "./Blog.css";
import { FaCalendar, FaUser, FaSearch } from "react-icons/fa";

export default function Blog() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/articles/published");
      const data = await response.json();
      setArticles(data);
      setFilteredArticles(data);
      
      const uniqueCategories = [...new Set(data.map((article) => article.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    filterArticles(keyword, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterArticles(searchKeyword, category);
  };

  const filterArticles = (keyword, category) => {
    let filtered = articles;

    if (keyword) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(keyword.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((article) => article.category === category);
    }

    setFilteredArticles(filtered);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (selectedArticle) {
    return (
      <div className="article-detail-container">
        <button className="back-btn" onClick={() => setSelectedArticle(null)}>
          ← Back to Blog
        </button>

        <article className="article-full">
          <div className="article-header">
            <h1>{selectedArticle.title}</h1>
            <div className="article-meta">
              <span className="meta-item">
                <FaUser /> {selectedArticle.author}
              </span>
              <span className="meta-item">
                <FaCalendar /> {formatDate(selectedArticle.publishedAt)}
              </span>
              <span className="category-tag">{selectedArticle.category}</span>
            </div>
          </div>

          {selectedArticle.image && (
            <img src={selectedArticle.image} alt={selectedArticle.title} className="article-image" />
          )}

          <div className="article-content">
            {selectedArticle.content}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>Service Spot Blog</h1>
        <p>Tips, guides, and insights about finding and using local services</p>
      </div>

      <div className="blog-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchKeyword}
            onChange={handleSearch}
          />
        </div>

        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="articles-section">
        {loading ? (
          <p className="loading-message">Loading articles...</p>
        ) : filteredArticles.length > 0 ? (
          <div className="articles-list">
            {filteredArticles.map((article) => (
              <div key={article.id} className="article-card">
                {article.image && (
                  <div className="article-image-container">
                    <img src={article.image} alt={article.title} />
                  </div>
                )}
                <div className="article-content-preview">
                  <div className="article-category">{article.category}</div>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div className="article-footer">
                    <div className="article-meta-info">
                      <span className="author">
                        <FaUser /> {article.author}
                      </span>
                      <span className="date">
                        <FaCalendar /> {formatDate(article.publishedAt)}
                      </span>
                    </div>
                    <button
                      className="read-more-btn"
                      onClick={() => setSelectedArticle(article)}
                    >
                      Read More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-articles">No articles found. Try adjusting your search.</p>
        )}
      </div>
    </div>
  );
}
