# Enterprise Security Architecture - QuickServe

**Date**: January 3, 2026  
**Project**: QuickServe - Service Booking Platform  
**Status**: ✅ FULLY IMPLEMENTED  
**Version**: 1.5.0

---

## 🎯 Overview

Enterprise-grade security architecture for QuickServe with BCrypt password hashing, AES phone encryption, custom exceptions, specialized DTOs, and secure controller integration across all endpoints.

---

## � Security Layer

### PasswordEncoderConfig.java
**Location**: `backend/src/main/java/Team/C/Service/Spot/security/PasswordEncoderConfig.java`

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(10);
}
```

**Features**:
- BCrypt algorithm with strength 10
- Injected into all controllers requiring password operations

### AESEncryptionService.java
**Location**: `backend/src/main/java/Team/C/Service/Spot/security/AESEncryptionService.java`

**Features**:
- AES-128/ECB/PKCS5Padding encryption
- Two-way encryption for sensitive data like phone numbers
- Encrypt on save, decrypt on display

**Methods**:
```java
public String encrypt(String plainText)  // Encrypt phone before DB storage
public String decrypt(String encryptedText)  // Decrypt phone for API response
```

---

## 🎮 Controller Integration

### CustomerController.java
**Location**: `backend/src/main/java/Team/C/Service/Spot/controller/CustomerController.java`

| Method | BCrypt Integration | AES Integration |
|--------|-------------------|-----------------|
| `signup()` | `passwordEncoder.encode(dto.getPassword())` | `aesEncryptionService.encrypt(dto.getPhone())` |
| `login()` | `passwordEncoder.matches(dto.getPassword(), stored)` | - |
| `mapToDTO()` | - | `aesEncryptionService.decrypt(customer.getPhone())` |

### ProviderController.java
**Location**: `backend/src/main/java/Team/C/Service/Spot/controller/ProviderController.java`

| Method | BCrypt Integration | AES Integration |
|--------|-------------------|-----------------|
| `signup()` | `passwordEncoder.encode(dto.getPassword())` | `aesEncryptionService.encrypt(dto.getPhone())` |
| `login()` | `passwordEncoder.matches(dto.getPassword(), stored)` | - |
| `mapToDTO()` | - | `aesEncryptionService.decrypt(provider.getPhone())` |

### ServiceController.java
**Location**: `backend/src/main/java/Team/C/Service/Spot/controller/ServiceController.java`

| Method | AES Integration |
|--------|-----------------|
| `convertToDTO()` | `aesEncryptionService.decrypt(provider.getPhone())` |

### AdminController.java
**Location**: `backend/src/main/java/Team/C/Service/Spot/controller/AdminController.java`

| Method | AES Integration |
|--------|-----------------|
| `getAllCustomers()` | `aesEncryptionService.decrypt(customer.getPhone())` |
| `getAllProviders()` | `aesEncryptionService.decrypt(provider.getPhone())` |

### SearchController.java
**Location**: `backend/src/main/java/Team/C/Service/Spot/controller/SearchController.java`

| Method | AES Integration |
|--------|-----------------|
| `mapToDTO()` | `aesEncryptionService.decrypt(provider.getPhone())` |

### BookingController.java
**Location**: `backend/src/main/java/Team/C/Service/Spot/controller/BookingController.java`

| Method | AES Integration |
|--------|-----------------|
| `convertToDTO()` | Decrypts `customerPhone`, `providerPhone`, `providerBookerPhone` |

---

## 🔒 Encryption Strategy

| Field | Encryption Type | Algorithm | Reason |
|-------|----------------|-----------|--------|
| **Password** | One-way hash | BCrypt (strength 10) | Only need to verify, never retrieve |
| **Phone** | Two-way encrypt | AES-128 | Need to search and display |
| **Email** | Plain text | - | Used for login and search |
| **Name** | Plain text | - | Public display field |

**Phone Encryption Flow**:
```
User Input       →  encrypt()      →  Database       →  decrypt()      →  API Response
"9876543210"     →  "A3B8K9x2..."  →  (encrypted)    →  "9876543210"
```

---

## ⚠️ Exception Handling

**Location**: `backend/src/main/java/Team/C/Service/Spot/exception/`

| Exception | HTTP Code | Trigger |
|-----------|-----------|---------|
| `ResourceNotFoundException` | 404 | Entity not found |
| `DuplicateEmailException` | 409 | Email already registered |
| `DuplicatePhoneException` | 409 | Phone already registered |
| `InvalidCredentialsException` | 401 | Wrong email/password |

### GlobalExceptionHandler.java
**Location**: `backend/src/main/java/Team/C/Service/Spot/config/GlobalExceptionHandler.java`

- Handlers for all custom exceptions
- Validation error handling with field-level messages
- Consistent JSON error response format

---

## 📝 Specialized DTOs

### Customer DTOs
**Location**: `backend/src/main/java/Team/C/Service/Spot/dto/customer/`

| DTO | Purpose |
|-----|---------|
| `CustomerRegistrationDTO` | Signup with full validation |
| `CustomerLoginDTO` | Auth (email + password) |
| `CustomerResponseDTO` | API response (**no password**) |
| `CustomerUpdateDTO` | Partial updates |

### Provider DTOs
**Location**: `backend/src/main/java/Team/C/Service/Spot/dto/provider/`

| DTO | Purpose |
|-----|---------|
| `ProviderRegistrationDTO` | Signup with full validation |
| `ProviderLoginDTO` | Auth (email + password) |
| `ProviderResponseDTO` | API response (**no password**) |
| `ProviderUpdateDTO` | Partial updates |

---

## 🗺️ Mapper Utilities

**Location**: `backend/src/main/java/Team/C/Service/Spot/mapper/`

| Mapper | Methods |
|--------|---------|
| `CustomerMapper` | `registrationDtoToEntity()`, `entityToResponseDto()`, `updateEntityFromDto()` |
| `ProviderMapper` | `registrationDtoToEntity()`, `entityToResponseDto()`, `updateEntityFromDto()` |

---

## 🏗️ Service Interfaces

### ICustomerService
**Location**: `backend/src/main/java/Team/C/Service/Spot/service/interfaces/ICustomerService.java`

### CustomerServiceImpl
**Location**: `backend/src/main/java/Team/C/Service/Spot/service/impl/CustomerServiceImpl.java`

**Features**:
- BCrypt password hashing on registration
- BCrypt password verification on login
- Email/Phone uniqueness validation

---

## 📦 Dependencies

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

---

## 📊 Files Summary

### New Files (18)
| Category | Count |
|----------|-------|
| Security Config | 2 (PasswordEncoder + AES) |
| Exceptions | 4 |
| Customer DTOs | 4 |
| Provider DTOs | 4 |
| Mappers | 2 |
| Service Interface/Impl | 2 |

### Modified Files (10)
- `GlobalExceptionHandler.java` — Custom exception handlers
- `CustomerRepo.java` — Added `findByPhone()`
- `ProviderRepo.java` — Added `findByPhone()`
- `CustomerController.java` — BCrypt + AES integration
- `ProviderController.java` — BCrypt + AES integration
- `ServiceController.java` — AES phone decryption
- `AdminController.java` — AES phone decryption
- `SearchController.java` — AES phone decryption
- `BookingController.java` — AES phone decryption
- `pom.xml` — Validation dependency

---

## 🔍 Verification in MySQL

To verify encryption is working:

```sql
-- Check encrypted phone numbers
SELECT id, name, email, phone, password 
FROM customer 
ORDER BY id DESC LIMIT 5;
```

**Expected Result**:
- **phone**: Base64 encoded string (e.g., `dXN5bWV0cmljX2VuY3J5cHQ=`)
- **password**: BCrypt hash (e.g., `$2a$10$abc123...`)

---

## ⚠️ Migration Notes

> **Breaking Change**: Existing users with plain-text passwords and unencrypted phone numbers cannot login. New registration required.

---

**Build Status**: ✅ SUCCESS  
**Last Updated**: January 3, 2026
