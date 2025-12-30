import React, { useState, useEffect } from "react";
import "./Home.css";
import Search from "../components/Search";

const AnimatedCounter = ({ end, duration = 2000, format = "number" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrameId;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (format === "decimal") {
        setCount((end * progress).toFixed(1));
      } else {
        setCount(Math.floor(end * progress));
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration, format]);

  return count;
};

export default function Home() {
  const [stats, setStats] = useState({
    tasksCompleted: 6000,
    verifiedProfessionals: 1200,
    customerSatisfaction: 4.9
  });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    fetchStatistics();
    setAnimated(true);
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/statistics", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats({
            tasksCompleted: data.tasksCompleted || 6000,
            verifiedProfessionals: data.verifiedProfessionals || 1200,
            customerSatisfaction: data.customerSatisfaction || 4.9
          });
        }
      }
    } catch (error) {
      console.log("Using static statistics", error);
    }
  };

  return (
    <div className="home-container">
      
      {/* HERO SECTION */}
      <section className="home-hero section-shell">
        
        <div className="hero-copy">
          <span className="hero-pill">✨ Book trusted experts instantly</span>

          <h1>Your One-Stop Platform to Find Skilled & Verified Professionals</h1>

          <p>
            Compare top-rated service providers, view transparent prices,
            and hire with confidence. ServiceSpot makes every booking simple,
            fast, and trustworthy.
          </p>

          {/* BUTTONS */}
          <div className="hero-actions">
            <button
              className="primary-btn"
              onClick={() => (window.location.href = "/register")}
            >
              🚀 Get Started
            </button>

            <button
              className="ghost-btn"
              onClick={() => (window.location.href = "/login")}
            >
              🔍 Explore Providers
            </button>
          </div>

          {/* METRICS */}
          <div className="hero-metrics">
            <div>
              <strong>
                {animated ? (
                  <>
                    <AnimatedCounter end={stats.tasksCompleted} duration={2000} format="number" />k+
                  </>
                ) : (
                  "6k+"
                )}
              </strong>
              <span>Tasks Completed</span>
            </div>

            <div>
              <strong>
                {animated ? (
                  <>
                    <AnimatedCounter 
                      end={Math.round((stats.verifiedProfessionals / 1000) * 10) / 10} 
                      duration={2000} 
                      format="decimal" 
                    />k
                  </>
                ) : (
                  "1.2k"
                )}
              </strong>
              <span>Verified Professionals</span>
            </div>

            <div>
              <strong>
                {animated ? (
                  <>
                    <AnimatedCounter 
                      end={stats.customerSatisfaction} 
                      duration={2000} 
                      format="decimal" 
                    />
                  </>
                ) : (
                  "4.9"
                )}/5
              </strong>
              <span>Customer Satisfaction</span>
            </div>
          </div>
        </div>

        {/* WHY SERVICESPOT CARD */}
        <div className="hero-card">
          <h3>Why Choose ServiceSpot? ⭐</h3>

          <ul>
            <li>Background-verified professionals</li>
            <li>Instant booking slots matching your schedule</li>
            <li>Transparent pricing — no hidden charges</li>
            <li>24/7 customer support anytime you need</li>
          </ul>
        </div>
      </section>

      {/* SEARCH BAR */}
      <div className="home-search section-shell">
        <Search />
      </div>

      {/* HIGHLIGHTS */}
      <section className="home-highlights section-shell">

        <article className="highlight-card">
          <h4>🔎 Search • Compare • Book</h4>
          <p>
            Discover nearby experts with detailed profiles, real reviews,
            and live availability—all in one place.
          </p>
        </article>

        <article className="highlight-card">
          <h4>📡 Live Status Tracking</h4>
          <p>
            Stay informed from booking to completion with real-time updates,
            notifications, and instant chat.
          </p>
        </article>

        <article className="highlight-card">
          <h4>💳 Secure & Protected Payments</h4>
          <p>
            Pay safely and release payments only when you're 100% satisfied
            with the service delivered.
          </p>
        </article>
      </section>
    </div>
  );
}
