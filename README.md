# ServiceSpot - Professional Service Booking Platform

A modern, full-stack web application that connects customers with verified service professionals. Built with **React**, **Spring Boot**, and **MySQL**, ServiceSpot streamlines the process of finding, comparing, and booking trusted service providers.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Key Features Explained](#key-features-explained)
- [Contributing](#contributing)

---

## 🎯 Overview

**ServiceSpot** is a comprehensive service booking platform that bridges the gap between customers needing services and skilled professionals offering them. The platform provides:

- **Customer-Centric Booking**: Intuitive search, filtering, and instant booking
- **Provider Management**: Complete profile management and service listings
- **Real-Time Location Services**: Map-based provider discovery using Leaflet
- **Verification System**: Professional verification for trust and security
- **Admin Dashboard**: Complete system management and monitoring
- **Modern UI/UX**: Vibrant gradient colors, smooth animations, and responsive design

---

## ✨ Features

### For Customers
- 🔍 **Advanced Search**: Find services by name, location, and category
- 📍 **Location-Based Discovery**: Nearby providers on interactive map
- ⭐ **Rating & Reviews**: View provider ratings and customer feedback
- 💳 **Secure Booking**: Book services with transparent pricing
- 📱 **Responsive Design**: Works seamlessly on all devices
- 📊 **Real-Time Tracking**: Monitor booking status from request to completion
- 🔔 **Real-Time Notifications**: Instant booking updates via WebSocket
- 📧 **OTP Verification**: Secure email verification during registration

### For Service Providers
- 📝 **Profile Management**: Complete service listings and availability
- ✅ **Verification Process**: Get verified to build customer trust
- 💰 **Transparent Pricing**: Set and manage service rates
- 📈 **Performance Analytics**: Track completed jobs and customer ratings
- 🔔 **Booking Notifications**: Real-time alerts for new requests
- ⭐ **Review Notifications**: Instant alerts when customers leave reviews

### For Administrators
- 👥 **User Management**: Manage customers, providers, and staff
- ✔️ **Verification Control**: Approve/reject provider verifications
- 📊 **System Statistics**: Track platform metrics and analytics
- 🛡️ **Content Moderation**: Monitor and manage platform content
- 🔔 **Admin Notifications**: Alerts for new registrations and contact form submissions

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - Modern UI framework
- **Vite 7.2** - Fast build tool and dev server
- **React Router 6.30** - Client-side routing
- **Leaflet & React-Leaflet** - Interactive mapping
- **Axios** - HTTP client
- **React Icons** - Icon library
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Spring Boot 3.3.4** - Java framework
- **Spring Data JPA** - ORM and database layer
- **Spring WebSocket (STOMP)** - Real-time notifications
- **MySQL** - Relational database
- **Java 21** - Latest Java features
- **JavaMailSender** - OTP email verification
- **Maven** - Build automation

### DevOps & Tools
- **Node.js & npm** - Frontend package management
- **Maven** - Java dependency management
- **Git & GitHub** - Version control
- **ESLint** - Code quality

---

## 🏗️ Architecture

### Application Structure

```
ServiceSpot/
├── frontend/                 # React Application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── App.jsx          # Main app component
│   │   └── index.css        # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Spring Boot Application
│   ├── src/main/java/Team/C/Service/Spot/
│   │   ├── controller/      # REST API endpoints
│   │   ├── services/        # Business logic
│   │   ├── model/           # Entity models
│   │   ├── repositery/      # Database access
│   │   └── Application.java # Entry point
│   ├── pom.xml
│   └── application.properties
│
└── README.md               # This file
```

---

## 💻 Installation & Setup

### Prerequisites
- **Java 21+** installed and configured
- **Node.js 16+** and npm
- **MySQL 8+** running locally
- **Maven** installed
- **Git** for version control

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/service-spot.git
   cd service-spot/backend
   ```

2. **Configure MySQL**
   - Create a new MySQL database: `servicespot`
   - Update `application.properties` with your credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/servicespot
   spring.datasource.username=yourusername
   spring.datasource.password=yourpassword
   spring.jpa.hibernate.ddl-auto=update
   ```

3. **Build the project**
   ```bash
   mvn clean install
   ```

4. **Run the backend server**
   ```bash
   mvn spring-boot:run
   ```
   Backend runs on: **http://localhost:8080**

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (if needed)
   ```env
   VITE_API_URL=http://localhost:8080
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Frontend runs on: **http://localhost:5173**

---

## 🚀 Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
mvn spring-boot:run
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

### Build for Production

**Frontend**
```bash
npm run build
npm run preview
```

**Backend**
```bash
mvn clean package
java -jar target/Service-Spot-0.0.1-SNAPSHOT.jar
```

---

## 📁 Project Structure

### Frontend Components

| Component | Purpose |
|-----------|---------|
| **Navbar** | Navigation header with search integration |
| **Search** | Service search functionality |
| **Home** | Landing page with hero and feature highlights |
| **SearchResults** | Filtered results with advanced filters |
| **NearbyServices** | Map-based provider discovery |
| **BookService** | Complete booking workflow |
| **CustomerProfile** | Customer account management |
| **ProviderDashboard** | Provider analytics and bookings |

### Backend Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User authentication |
| `/api/providers` | GET | Get all providers |
| `/api/providers/{id}` | GET | Get provider details |
| `/booking` | POST | Create new booking |
| `/booking/{id}` | GET | Get booking details |
| `/api/search` | GET | Search services |
| `/api/admin/statistics` | GET | Get platform statistics |

---

## 🗄️ Database Schema

### Main Tables

**Users Table**
- Stores customer, provider, and admin information
- Fields: id, name, email, phone, password, role, verified, created_at

**Services Table**
- Service offerings with pricing and details
- Fields: id, name, provider_id, category_id, price, description, rating, status

**Bookings Table**
- Booking records with status tracking
- Fields: id, customer_id, provider_id, service_id, booking_date, status, amount

**Providers Table**
- Extended provider information
- Fields: id, user_id, service_type, city, state, verified, price, distance

**Categories Table**
- Service categories for organization
- Fields: id, name, description

**Reviews Table**
- Customer reviews and ratings
- Fields: id, booking_id, rating, comment, created_at

---

## 🎨 Key Features Explained

### 1. Dynamic Home Page
- Animated metrics counters showing real-time statistics
- Fetches data from `/api/admin/statistics` endpoint
- Falls back to static values if backend unavailable
- Vibrant gradient design with smooth animations

### 2. Location-Based Discovery
- Integration with Leaflet maps
- Real-time geolocation using browser API
- Dynamic provider filtering by distance
- Color-coded markers for provider status

### 3. Advanced Search & Filters
- Multi-criteria filtering (service type, location, price)
- Sorting by relevance, rating, or price
- Live result updates with optimized performance
- Responsive filter sidebar

### 4. Booking Restrictions
- Customers can book services
- Providers/admins cannot book (enforcement with toast notifications)
- Role-based access control
- Automatic redirects for unauthorized users

### 5. Role-Based Access Control
- **Customer Role**: Can browse, search, and book services
- **Provider Role**: Can manage services and view bookings
- **Admin Role**: Full system access and management

### 6. Modern UI/UX
- Vibrant color scheme (Indigo, Pink, Orange)
- Smooth animations and transitions
- Toast notifications instead of alerts
- Fully responsive design for all devices

---

## 🔐 Security Features

- Password encryption with BCrypt
- OTP-based email verification for registration
- CORS configuration for frontend-backend communication
- Role-based authorization on API endpoints
- XSS and CSRF protection
- SQL injection prevention through JPA

---

## 📊 Statistics & Metrics

The platform tracks:
- **Tasks Completed**: Total service bookings fulfilled
- **Verified Professionals**: Number of verified providers
- **Customer Satisfaction**: Average rating (out of 5)
- **Active Users**: Registered customers and providers

---

## 🧪 Testing

### API Testing
PowerShell test scripts are provided in the root directory:
```bash
.\test_provider_signup.ps1
.\test_customer_signup.ps1
.\test_search.ps1
.\test_booking.ps1
```

### Frontend Testing
```bash
npm run lint
npm run build
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit messages clearly (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Standards
- Follow existing code style
- Write clean, readable code
- Add comments for complex logic
- Test before submitting PR
- Update documentation

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👥 Team

ServiceSpot is developed by **Team C** as a comprehensive service booking platform.

---

## 📧 Support & Contact

For issues, features requests, or questions:
- Open an issue on GitHub
- Check existing documentation in `/docs`
- Review test files for usage examples

---

## 🚀 Future Enhancements

- Advanced analytics dashboard
- Mobile app (React Native)
- Push notifications for mobile devices
- Service subscription plans
- Rating and review moderation system
- Payment gateway integration

---

## 📚 Additional Resources

- [Frontend README](./frontend/README.md)
- [API Documentation](./docs/API.md)
- [Setup Guide](./SETUP_AND_TEST.md)
- [Testing Guide](./TESTING_GUIDE.md)

---

**Made with ❤️ by Team C**

Last Updated: December 2025
