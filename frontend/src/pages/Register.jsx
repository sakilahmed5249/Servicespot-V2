import React from "react";
import "./Register.css";
import { FaUserPlus, FaUserTie, FaShoppingBag } from "react-icons/fa";

export default function Register() {
  return (
    <div className="register-container">
      <FaUserPlus size={80} color="#0A4D68" className="register-header-icon" />
      
      <h1>Register</h1>
      <p>Select your account type</p>

      <div className="register-buttons">
        <button onClick={() => window.location.href = "/register-customer"}>
          <FaShoppingBag size={24} className="button-icon" />
          <span>Customer Register</span>
        </button>

        <button onClick={() => window.location.href = "/register-provider"}>
          <FaUserTie size={24} className="button-icon" />
          <span>Provider Register</span>
        </button>
      </div>
    </div>
  );
}
