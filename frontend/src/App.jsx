import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { NotificationProvider } from "./context/NotificationContext";

// Pages
import Home from "./pages/Home";

// Register
import Register from "./pages/Register";
import RegisterCustomer from "./pages/RegisterCustomer";
import RegisterProvider from "./pages/RegisterProvider";

// Login
import Login from "./pages/Login";
import LoginCustomer from "./pages/LoginCustomer";
import LoginProvider from "./pages/LoginProvider";
import LoginAdmin from "./pages/LoginAdmin";

// Customer
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerProfile from "./pages/CustomerProfile";
import CustomerUpdate from "./pages/CustomerUpdate";
import CustomerBookings from "./pages/CustomerBookings";
import BookService from "./pages/BookService";

// Provider
import ProviderProfile from "./pages/ProviderProfile";
import ProviderUpdate from "./pages/ProviderUpdate";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderBookings from "./pages/ProviderBookings";

// Admin
import AdminDashboard from "./pages/AdminDashboard";
import AdminCustomers from "./pages/AdminCustomers";
import AdminProviders from "./pages/AdminProviders";
import AdminContacts from "./pages/AdminContacts";

// Other
import SearchResults from "./pages/SearchResults";
import NearbyServices from "./pages/NearbyServices";
import Contact from "./pages/Contact";

import OTPVerification from "./pages/OTPVerification";
import ForgotPassword from "./pages/ForgotPassword";
import Notifications from "./pages/Notifications";

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <Navbar />   {/* ⭐ NAVBAR ALWAYS VISIBLE */}

        <Routes>

          <Route path="/" element={<Home />} />

          {/* Register */}
          <Route path="/register" element={<Register />} />
          <Route path="/register-customer" element={<RegisterCustomer />} />
          <Route path="/register-provider" element={<RegisterProvider />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/login-customer" element={<LoginCustomer />} />
          <Route path="/login-provider" element={<LoginProvider />} />
          <Route path="/login-admin" element={<LoginAdmin />} />

          {/* Customer */}
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/customer-profile" element={<CustomerProfile />} />
          <Route path="/customer-update" element={<CustomerUpdate />} />
          <Route path="/customer-bookings" element={<CustomerBookings />} />
          <Route path="/book-service" element={<BookService />} />

          {/* Provider */}
          <Route path="/provider-profile" element={<ProviderProfile />} />
          <Route path="/provider-update" element={<ProviderUpdate />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/provider-bookings" element={<ProviderBookings />} />

          {/* Admin */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-customers" element={<AdminCustomers />} />
          <Route path="/admin-providers" element={<AdminProviders />} />
          <Route path="/admin-contacts" element={<AdminContacts />} />

          {/* Contact & Search */}
          <Route path="/search" element={<SearchResults />} />
          <Route path="/nearby-services" element={<NearbyServices />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact-help" element={<Contact />} />


          <Route path="/login" element={<Login />} />
          <Route path="/login-customer" element={<LoginCustomer />} />
          <Route path="/login-provider" element={<LoginProvider />} />
          <Route path="/login-admin" element={<LoginAdmin />} />

          {/* ⭐ NEW: OTP Verification & Password Reset */}
          <Route path="/verify-email" element={<OTPVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ⭐ Notifications */}
          <Route path="/notifications" element={<Notifications />} />

        </Routes>

        <Footer />
      </NotificationProvider>
    </BrowserRouter>
  );
}
