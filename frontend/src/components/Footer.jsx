import React from "react";
import "./Footer.css";
import { FaFacebook, FaInstagram, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHeadset } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-section">
        <h3 className="footer-brand">ServiceSpot</h3>
        <p className="footer-description">Your trusted platform for connecting customers with reliable service providers. Discover quality services near you.</p>
        <div className="social-icons">
          <a href="#" className="social" title="Facebook"><FaFacebook /></a>
          <a href="#" className="social" title="Instagram"><FaInstagram /></a>
          <a href="#" className="social" title="Twitter"><FaTwitter /></a>
        </div>
      </div>

      <div className="footer-section">
        <h4>For Customers</h4>
        <ul>
          <li><a href="/">Browse Services</a></li>
          <li><a href="/register-customer">Register as Customer</a></li>
          <li><a href="/search">Search Services</a></li>
          <li><a href="/contact">Support & Help</a></li>
        </ul>
      </div>

      <div className="footer-section">
        <h4>For Service Providers</h4>
        <ul>
          <li><a href="/register-provider">Register as Provider</a></li>
          <li><a href="/login-provider">Provider Dashboard</a></li>
          <li><a href="/contact">Pricing & Rates</a></li>
          <li><a href="/contact">Provider Support</a></li>
        </ul>
      </div>

      <div className="footer-section">
        <h4>Company</h4>
        <ul>
          <li><a href="/contact">About Us</a></li>
          <li><a href="/contact">Privacy Policy</a></li>
          <li><a href="/contact">Terms & Conditions</a></li>
          <li><a href="/contact">Help & Support</a></li>
        </ul>
      </div>

      <div className="footer-section">
        <h4>Get in Touch</h4>
        <div className="contact-info">
          <p><FaPhone className="contact-icon" /> +91 9876543210</p>
          <p><FaEnvelope className="contact-icon" /> support@servicespot.com</p>
          <p><FaMapMarkerAlt className="contact-icon" /> India</p>
          <p><FaHeadset className="contact-icon" /> 24/7 Customer Support</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} ServiceSpot. All Rights Reserved.</p>
          <div className="footer-links">
            <a href="/contact">Privacy Policy</a>
            <span className="divider">•</span>
            <a href="/contact">Terms & Conditions</a>
            <span className="divider">•</span>
            <a href="/contact">Cookie Policy</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
