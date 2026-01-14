# Real-Time Notification System - QuickServe

## 🔔 Overview
This document describes the implementation of a Facebook-like real-time, persistent notification system for the QuickServe application.

---

## 📋 Table of Contents
1. [Features](#features)
2. [Architecture](#architecture)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [API Endpoints](#api-endpoints)
6. [WebSocket Integration](#websocket-integration)
7. [Notification Types](#notification-types)
8. [Usage Examples](#usage-examples)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Real-Time Features
- ✅ **Instant Notifications**: WebSocket-based real-time delivery
- ✅ **Browser Notifications**: Native browser notification support
- ✅ **Live Badge Counter**: Real-time unread count updates
- ✅ **Auto-Connect**: Automatic WebSocket reconnection on disconnect
- ✅ **Dynamic User Detection**: Detects login/logout across tabs instantly

### Persistence Features
- ✅ **Database Storage**: All notifications stored in MySQL
- ✅ **Read/Unread Status**: Track notification read status
- ✅ **Notification History**: Access past notifications
- ✅ **Mark as Read**: Individual and bulk mark as read
- ✅ **Delete Notifications**: Remove unwanted notifications

### User Experience
- ✅ **Priority Levels**: HIGH, NORMAL, LOW priority notifications
- ✅ **Categorization**: Filter by type (all, unread)
- ✅ **Action URLs**: Direct navigation to related pages
- ✅ **Timestamp Display**: Relative time (2m ago, 1h ago, etc.)
- ✅ **Visual Indicators**: Icons, colors, and badges
- ✅ **Review Comments**: Amazon-style review display integration

### Multi-Role Support
- ✅ **Admin Notifications**: New registrations, contact form submissions
- ✅ **Customer Notifications**: Booking updates, confirmations
- ✅ **Provider Notifications**: New bookings, cancellations, customer reviews

---

## 🏗️ Architecture

### Technology Stack

#### Backend
- **Java 21** - Core language version
- **Spring Boot 3.4.1** - Application framework
- **WebSocket (STOMP)** - Real-time communication
- **Spring Data JPA** - Database persistence
- **MySQL** - Notification storage
- **Lombok** - Code generation

#### Frontend
- **React 18.2.0** - UI framework
- **@stomp/stompjs** - WebSocket client
- **sockjs-client** - WebSocket fallback
- **React Context API** - State management
- **React Router** - Navigation

### System Flow

```
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│   Browser   │◄────────►│   Backend   │◄────────►│   Database  │
│  (React)    │ WebSocket│ (Spring)    │   JPA    │   (MySQL)   │
└─────────────┘          └─────────────┘          └─────────────┘
      │                         │
      │                         │
   Context                 Controller
   Provider                 Service Layer
      │                         │
  Components               Repository
```

---

## 🔧 Backend Implementation

### 1. Database Model

**File:** `backend/src/main/java/Team/C/Service/Spot/model/Notification.java`

```java
@Entity
@Table(name = "notifications")
public class Notification {
    private Long id;
    private String recipientEmail;
    private String recipientRole;  // ADMIN, CUSTOMER, SERVICE_PROVIDER
    private String title;
    private String message;
    private String type;           // BOOKING_CREATED, REVIEW_RECEIVED, etc.
    private Boolean isRead;
    private Long relatedEntityId;
    private String relatedEntityType;
    private String actionUrl;
    private String senderName;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
    private String priority;       // HIGH, NORMAL, LOW
}
```

### 2. Repository Layer

**File:** `backend/src/main/java/Team/C/Service/Spot/repositery/NotificationRepo.java`

Key methods:
- `findByRecipientEmailOrderByCreatedAtDesc()` - Get all notifications
- `findByRecipientEmailAndIsReadFalseOrderByCreatedAtDesc()` - Get unread
- `countByRecipientEmailAndIsReadFalse()` - Count unread
- `markAllAsRead()` - Bulk update
- `deleteOldReadNotifications()` - Cleanup

### 3. Service Layer

**File:** `backend/src/main/java/Team/C/Service/Spot/services/NotificationService.java`

Key features:
- Creates and persists notifications
- Sends real-time notifications via WebSocket
- Helper methods for common notification types
- Cleanup utilities

### 4. WebSocket Configuration

**File:** `backend/src/main/java/Team/C/Service/Spot/config/WebSocketConfig.java`

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    // Endpoint: /ws-notifications
    // User channel: /user/{email}/queue/notifications
}
```

### 5. Integration Controllers

**RatingController:** (`backend/src/main/java/Team/C/Service/Spot/controller/RatingController.java`)
- Handles review submissions via `/api/rating/create`
- Triggers `notificationService.notifyReviewReceived`
- Sends "New Review Received" notification to provider

**BookingController:** (`backend/src/main/java/Team/C/Service/Spot/controller/BookingController.java`)
- Handles booking creation/updates
- Triggers relevant notifications (Created, Confirmed, Cancelled, Completed)

**CustomerController:** (`backend/src/main/java/Team/C/Service/Spot/controller/CustomerController.java`)
- Handles customer registration via `/api/customer/signup`
- Sends "New Customer Registered" notification to admin

**ProviderController:** (`backend/src/main/java/Team/C/Service/Spot/controller/ProviderController.java`)
- Handles provider registration via `/api/provider/signup`
- Sends "New Provider Registered" notification to admin

**ContactController:** (`backend/src/main/java/Team/C/Service/Spot/controller/ContactController.java`)
- Handles contact form submissions via `/api/contact`
- Sends "New Contact Form Submission" notification to admin

---

## 🎨 Frontend Implementation

### 1. Notification Context

**File:** `frontend/src/context/NotificationContext.jsx`

Updated Mechanism:
- Uses `useState` and `useEffect` for `userEmail`
- Listens to `storage` events to detect login/logout across tabs
- Polls `localStorage` for same-tab login changes
- Automatically reconnects WebSocket when user changes

Provides:
- WebSocket connection management
- Notification state management
- Real-time notification handling
- Browser notification support
- CRUD operations

### 2. Notification Bell Component

**File:** `frontend/src/components/NotificationBell.jsx`

Features:
- Dropdown notification panel
- Unread badge counter
- Filter (all/unread)
- Mark as read/delete actions
- Time formatting

### 3. Book Service with Reviews

**File:** `frontend/src/pages/BookService.jsx`

Features:
- "Amazon-style" review display section
- Shows customer name, star rating, comment, and date
- Fetches reviews dynamically when service is selected

---

## 📡 API Endpoints

### Base URL: `http://localhost:8080/api/notifications`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create notification |
| GET | `/user/{email}` | Get all notifications |
| GET | `/user/{email}/unread` | Get unread notifications |
| GET | `/user/{email}/unread/count` | Get unread count |
| GET | `/user/{email}/recent?days=7` | Get recent notifications |
| PUT | `/{id}/read` | Mark as read |
| PUT | `/user/{email}/read-all` | Mark all as read |
| DELETE | `/{id}` | Delete notification |
| DELETE | `/cleanup?daysOld=30` | Cleanup old notifications |

---

## 🔌 WebSocket Integration

### Connection
**Endpoint:** `ws://localhost:8080/ws-notifications`

### Subscribe to Notifications
```javascript
stompClient.subscribe(
  `/user/${userEmail}/queue/notifications`,
  (message) => {
    const notification = JSON.parse(message.body);
    // Handle notification
  }
);
```

### Message Format
```json
{
  "id": 1,
  "title": "New Review Received",
  "message": "Ahmed has left a 5-star review for Plumbing Service",
  "type": "REVIEW_RECEIVED",
  "isRead": false,
  "priority": "NORMAL",
  "createdAt": "2025-12-30T10:30:00",
  "actionUrl": "/provider-dashboard"
}
```

---

## 📬 Notification Types

### Booking Notifications

| Type | Recipient | Trigger | Priority |
|------|-----------|---------|----------|
| `BOOKING_CREATED` | Provider | Customer creates booking | HIGH |
| `BOOKING_CONFIRMED` | Customer | Provider confirms | HIGH |
| `BOOKING_CANCELLED` | **Both customer & provider** | Either cancels | HIGH |
| `BOOKING_COMPLETED` | Customer | Provider marks complete | NORMAL |

### Review Notifications

| Type | Recipient | Trigger | Priority |
|------|-----------|---------|----------|
| `REVIEW_RECEIVED` | Provider | Customer leaves review | NORMAL |

### Admin Notifications

| Type | Recipient | Trigger | Priority |
|------|-----------|---------|----------|
| `NEW_CUSTOMER_REGISTERED` | Admin | Customer signs up | NORMAL |
| `NEW_PROVIDER_REGISTERED` | Admin | Provider signs up | HIGH |
| `CONTACT_FORM_SUBMITTED` | Admin | Contact form sent | NORMAL |

### Helper Methods in NotificationService

```java
// Provider gets notified of new booking
notificationService.notifyBookingCreated(
  providerEmail, customerName, bookingId, serviceName
);

// Customer gets notified of confirmation
notificationService.notifyBookingConfirmed(
  customerEmail, providerName, bookingId, serviceName
);

// Notify about cancellation
notificationService.notifyBookingCancelled(
  recipientEmail, role, senderName, bookingId, serviceName
);

// Notify about completion
notificationService.notifyBookingCompleted(
  customerEmail, providerName, bookingId, serviceName
);

// Notify about review
notificationService.notifyReviewReceived(
  providerEmail, customerName, reviewId, rating, serviceName
);
```

---

## 💡 Usage Examples

### 1. Integrate in RatingController

**In RatingController.java:**
```java
@PostMapping("/create")
public ResponseEntity<?> createRating(@RequestBody RatingDTO dto) {
    // ... create rating logic ...
    
    // Send notification
    notificationService.notifyReviewReceived(
        providerEmail,
        customerName,
        ratingId,
        stars,
        serviceName
    );
}
```

### 2. Use in React Component

```jsx
import { useNotifications } from '../context/NotificationContext';

function MyComponent() {
    const { 
        notifications, 
        unreadCount, 
        markAsRead 
    } = useNotifications();
    
    return (
        <div>
            <p>You have {unreadCount} unread notifications</p>
            {notifications.map(n => (
                <div onClick={() => markAsRead(n.id)}>
                    {n.title}: {n.message}
                </div>
            ))}
        </div>
    );
}
```

---

## 🧪 Testing

### 1. Backend Testing

#### Test Notification Creation
```bash
curl -X POST http://localhost:8080/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "admin@servicespot.com",
    "recipientRole": "ADMIN",
    "title": "Test Notification",
    "message": "This is a test",
    "type": "REVIEW_RECEIVED",
    "priority": "NORMAL"
  }'
```

### 2. Frontend Testing

1. **Login** as customer
2. **Book** a service and complete it
3. **Submit** a review
4. **Login** as provider (in another browser/tab)
5. **Verify** "New Review Received" notification appears

---

## 🔍 Troubleshooting

### Issue: Notifications not appearing after login
**Cause:** `NotificationContext` might not have picked up the email from `localStorage` if not using dynamic detection.
**Solution:** Ensure `NotificationContext.jsx` uses `window.addEventListener('storage', ...)` and `setInterval` to check for email changes. The current implementation includes this fix.

### Issue: "New Review" notification missing
**Cause:** Application using `ReviewController` instead of `RatingController`.
**Solution:** Notification logic was moved to `RatingController.java` (`/api/rating/create`) which handles the actual review submission.

### Issue: WebSocket connection fails
**Check:**
1. Backend WebSocket endpoint is accessible at `/ws-notifications`
2. CORS configuration in `WebSocketConfig` includes frontend URL
3. Java version matches environment (Project uses Java 21)

---

## 🐛 Bug Fixes

### Cancellation Notification Attribution (Fixed: January 14, 2026)

**Issue:** When a provider cancelled a booking, the notification incorrectly showed the customer's name as the canceller (e.g., "Henry cancelled" when Shilpa cancelled).

**Root Cause:** The `cancelBooking()` endpoint didn't track who initiated the cancellation. The backend always assumed the customer cancelled and used the customer's name in all cancellation notifications.

**Fix:** Added `cancelledBy` request parameter to the endpoint:

```java
// Backend - BookingController.java
@PutMapping("/cancel/{id}")
public ResponseEntity<?> cancelBooking(
        @PathVariable Long id,
        @RequestBody(required = false) Map<String, String> body) {
    
    String cancelledBy = (body != null && body.get("cancelledBy") != null) 
            ? body.get("cancelledBy").toUpperCase() 
            : "CUSTOMER";
    
    if ("PROVIDER".equals(cancelledBy)) {
        // Provider cancelled - notify customer with provider's name
    } else {
        // Customer cancelled - notify provider with customer's name
    }
}
```

**Frontend Updates:**
- `ProviderDashboard.jsx` sends `{ cancelledBy: "PROVIDER" }`
- `ProviderBookings.jsx` sends `{ cancelledBy: "PROVIDER" }`
- `CustomerBookings.jsx` sends `{ cancelledBy: "CUSTOMER" }`

**Impact:** Cancellation notifications now correctly identify who initiated the cancellation.

---

### Cancellation Notification Missing (Fixed: January 14, 2026)

**Issue:** When a provider cancelled a booking, the customer did not receive a notification.

**Root Cause:** The `cancelBooking()` method in `BookingController.java` (lines 348-364) had a logically unreachable `else if` condition:
```java
// BEFORE (BUG)
if (customer != null) {
    // Notify provider ✓
} else if (provider != null && customer != null) {  // UNREACHABLE!
    // Notify customer ✗ NEVER EXECUTED
}
```

**Fix:** Changed to notify BOTH customer AND provider:
```java
// AFTER (FIXED)
if (customer != null) {
    // Notify customer ✓
}
if (provider != null) {
    // Notify provider ✓
}
```

**Impact:** Both customers and providers now receive cancellation notifications regardless of who initiated the cancellation.

---

## 📄 License

This notification system is part of the QuickServe application.

---

**Last Updated:** December 30, 2025
**Version:** 1.2.0
**Author:** Senior Full Stack Java Developer
