<p align="center">
  <h1 align="center">🔧 QuickServe</h1>
  <p align="center">
    <strong>Localized Service Discovery & Booking Platform</strong>
  </p>
  <p align="center">
    A modern full-stack application connecting customers with verified service professionals
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen?style=flat-square&logo=springboot" alt="Spring Boot">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk" alt="Java">
  <img src="https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square&logo=mysql" alt="MySQL">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License">
</p>

---

## 📖 Overview

**QuickServe** is an enterprise-grade service booking platform that seamlessly connects customers with trusted service professionals. Built with modern technologies and security best practices, it offers real-time notifications, location-based discovery, and comprehensive management tools.

### ✨ Highlights

| Feature | Description |
|---------|-------------|
| 🗺️ **Location-Based Discovery** | Find nearby providers with interactive Leaflet maps |
| 🔔 **Real-Time Notifications** | WebSocket-powered instant updates |
| 🔐 **Enterprise Security** | BCrypt encryption, input validation, secure APIs |
| 📧 **OTP Verification** | Email-based account verification |
| ⭐ **Reviews & Ratings** | Amazon-style customer feedback system |
| 📱 **Responsive Design** | Seamless experience across all devices |

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="50%">

### Frontend
| Technology | Version |
|------------|---------|
| React | 19.2 |
| Vite | 7.2 |
| React Router | 6.30 |
| Leaflet | 1.9 |
| STOMP.js | 7.2 |
| Axios | 1.13 |

</td>
<td align="center" width="50%">

### Backend
| Technology | Version |
|------------|---------|
| Spring Boot | 3.3.4 |
| Java | 21 |
| Spring Security | 6.x |
| WebSocket (STOMP) | - |
| Jakarta Validation | - |
| MySQL | 8.0 |

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
QuickServe/
├── frontend/                          # React SPA
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   ├── pages/                    # Route pages
│   │   ├── context/                  # React Context (Auth, Notifications)
│   │   └── App.jsx                   # Main application
│   └── package.json
│
├── backend/                           # Spring Boot API
│   ├── src/main/java/.../
│   │   ├── controller/               # REST endpoints
│   │   ├── service/                  # Business logic
│   │   │   ├── interfaces/           # Service contracts
│   │   │   └── impl/                 # Implementations
│   │   ├── dto/                      # Data Transfer Objects
│   │   │   ├── customer/             # Customer DTOs
│   │   │   └── provider/             # Provider DTOs
│   │   ├── mapper/                   # Entity-DTO mappers
│   │   ├── model/                    # JPA entities
│   │   ├── repositery/               # Data access layer
│   │   ├── exception/                # Custom exceptions
│   │   ├── security/                 # Security config
│   │   └── config/                   # App configuration
│   └── pom.xml
│
└── docs/                              # Documentation
```

---

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- MySQL 8.0+
- Maven 3.9+

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/quickserve.git
cd quickserve

# Backend setup
cd backend
mvn clean install
mvn spring-boot:run

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

### Access Points
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| WebSocket | ws://localhost:8080/ws-notifications |

---

## 🔐 Security Architecture

### Password Security
- **BCrypt Hashing** — Industry-standard encryption (strength 10)
- **Zero Exposure** — Passwords never returned in API responses
- **Secure Change Flow** — Current password verification required

### Input Validation
```java
@NotBlank(message = "Email is required")
@Email(message = "Invalid email format")
private String email;

@Size(min = 8, message = "Password must be 8+ characters")
@Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$")
private String password;
```

### Exception Handling
| Exception | HTTP Code | Use Case |
|-----------|-----------|----------|
| `ResourceNotFoundException` | 404 | Entity not found |
| `DuplicateEmailException` | 409 | Email exists |
| `DuplicatePhoneException` | 409 | Phone exists |
| `InvalidCredentialsException` | 401 | Auth failure |

---

## 📡 API Overview

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/customer/signup` | Customer registration |
| POST | `/api/customer/login` | Customer login |
| POST | `/api/provider/signup` | Provider registration |
| POST | `/api/provider/login` | Provider login |

### Core Resources
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/provider/nearby` | Location-based search |
| POST | `/api/booking` | Create booking |
| GET | `/api/notifications/user/{email}` | Get notifications |
| POST | `/api/rating/create` | Submit review |

---

## 🔔 Notification System

Real-time notifications via WebSocket (STOMP protocol):

| Event | Recipient | Priority |
|-------|-----------|----------|
| Booking Created | Provider | HIGH |
| Booking Confirmed | Customer | HIGH |
| Booking Cancelled | Both Parties | HIGH |
| Review Received | Provider | NORMAL |
| New Registration | Admin | NORMAL |
| Contact Form Submission | Admin | NORMAL |



---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Customer** | Browse, book services, leave reviews, receive notifications |
| **Provider** | Manage profile, accept/reject bookings, view analytics |
| **Admin** | Full system access, user verification, platform monitoring |

---

## 📂 Documentation

| Document | Description |
|----------|-------------|
| [Security Architecture](./Security.md) | BCrypt, DTOs, exceptions |
| [Notification System](./NOTIFICATION_SYSTEM_README.md) | WebSocket implementation |
| [API Reference](./NOTIFICATION_SYSTEM_DOCUMENTATION.md) | Complete API docs |

---

## 🗓️ Roadmap

- [ ] Payment gateway integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Push notifications

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  <strong>Built with ❤️ by Team C</strong>
  <br>
  <sub>QuickServe v1.3.0 • December 2025</sub>
</p>
