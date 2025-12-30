import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./OTPVerification.css";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Get email from navigation state
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate("/login");
    }
  }, [location.state, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple digits
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = pastedData.split("");
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:8080/api/auth/verify-email", {
        email: email,
        otp: otpString
      });

      if (response.data.success) {
        setSuccess("Email verified successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login", { 
            state: { 
              message: "Email verified! You can now login.",
              email: email 
            } 
          });
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:8080/api/auth/resend-otp", {
        email: email,
        otpType: "REGISTRATION"
      });

      setSuccess("OTP sent successfully! Check your email.");
      setResendTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-verification-container">
      <div className="otp-card">
        <div className="otp-icon">
          <FaEnvelope size={60} color="#0A4D68" />
        </div>

        <h1>Verify Your Email</h1>
        <p className="otp-subtitle">
          We've sent a 6-digit code to<br />
          <strong>{email}</strong>
        </p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleVerify} className="otp-form">
          <div className="otp-inputs" onPaste={handlePaste}>
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

          <button 
            type="submit" 
            className="verify-btn"
            disabled={loading || otp.join("").length !== 6}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="resend-section">
          {canResend ? (
            <button 
              type="button" 
              className="resend-btn"
              onClick={handleResend}
              disabled={loading}
            >
              Resend OTP
            </button>
          ) : (
            <p className="timer-text">
              Resend OTP in <strong>{resendTimer}s</strong>
            </p>
          )}
        </div>

        <button 
          type="button"
          className="back-link"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}