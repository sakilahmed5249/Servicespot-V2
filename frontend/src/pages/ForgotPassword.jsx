import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPassword.css";
import { FaLock, FaEnvelope, FaKey } from "react-icons/fa";

export default function ForgotPassword() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Step 1: Request OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:8080/api/auth/forgot-password", {
        email: email
      });

      setSuccess("OTP sent to your email!");
      setTimeout(() => {
        setStep(2);
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please enter both password fields");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:8080/api/auth/reset-password", {
        email: email,
        otp: otpString,
        newPassword: newPassword
      });

      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login", { 
          state: { 
            message: "Password reset successful! You can now login with your new password.",
            email: email 
          } 
        });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP or failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-icon">
          <FaLock size={60} color="#0A4D68" />
        </div>

        <h1>Reset Your Password</h1>
        
        {/* Progress Indicator */}
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? "active" : ""}`}>
            <span>1</span>
            <p>Email</p>
          </div>
          <div className={`step-line ${step >= 2 ? "active" : ""}`}></div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>
            <span>2</span>
            <p>Verify & Reset</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="forgot-form">
            <p className="forgot-subtitle">
              Enter your email address and we'll send you an OTP to reset your password.
            </p>

            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

            <button 
              type="button"
              className="back-link"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </form>
        )}

        {/* Step 2: OTP & New Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="forgot-form">
            <p className="forgot-subtitle">
              Enter the OTP sent to <strong>{email}</strong> and your new password.
            </p>

            <div className="otp-section">
              <label>Enter OTP</label>
              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="otp-input"
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            <div className="input-group">
              <FaKey className="input-icon" />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
                minLength="6"
              />
            </div>

            <div className="input-group">
              <FaKey className="input-icon" />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength="6"
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <button 
              type="button"
              className="back-link"
              onClick={() => setStep(1)}
            >
              Back to Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}