import React from "react";
import "./Login.css";
import { FaUserCircle } from "react-icons/fa";

export default function Login() {
  return (
    <div className="login-select-container">
      <FaUserCircle size={90} color="#0A4D68" />

      <h1>Select Login Type</h1>

      <div className="login-select-buttons">
        <button onClick={() => window.location.href = "/login-customer"}>
          Customer Login
        </button>

        <button onClick={() => window.location.href = "/login-provider"}>
          Provider Login
        </button>

        <button onClick={() => window.location.href = "/login-admin"}>
          Admin Login
        </button>
      </div>
    </div>
  );
}
