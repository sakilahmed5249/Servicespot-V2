# Enterprise Security Architecture - QuickServe

**Date**: December 31, 2025  
**Project**: QuickServe - Service Booking Platform  
**Status**: ✅ FULLY IMPLEMENTED

---

## 🎯 Overview

Enterprise-grade security architecture for QuickServe with BCrypt password hashing, custom exceptions, specialized DTOs, and secure controller integration.

---

## 🔐 Security Layer

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

---

## 🎮 Controller Integration

### CustomerController.java
**Location**: `backend/src/main/java/Team/C/Service/Spot/controller/CustomerController.java`

| Method | BCrypt Integration |
|--------|-------------------|
| `signup()` | `passwordEncoder.encode(dto.getPassword())` |
| `login()` | `passwordEncoder.matches(dto.getPassword(), stored)` |

### ProviderController.java
**Location**: `backend/src/main/java/Team/C/Service/Spot/controller/ProviderController.java`

| Method | BCrypt Integration |
|--------|-------------------|
| `signup()` | `passwordEncoder.encode(dto.getPassword())` |
| `login()` | `passwordEncoder.matches(dto.getPassword(), stored)` |

---

## ⚠️ Exception Handling

**Location**: `backend/src/main/java/Team/C/Service/Spot/exception/`

| Exception | HTTP Code | Trigger |
|-----------|-----------|---------|
| `ResourceNotFoundException` | 404 | Entity not found |
| `DuplicateEmailException` | 409 | Email exists |
| `DuplicatePhoneException` | 409 | Phone exists |
| `InvalidCredentialsException` | 401 | Auth failure |

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
| `CustomerRegistrationDTO` | Signup validation |
| `CustomerLoginDTO` | Auth validation |
| `CustomerResponseDTO` | API response (no password) |
| `CustomerUpdateDTO` | Partial updates |

### Provider DTOs
**Location**: `backend/src/main/java/Team/C/Service/Spot/dto/provider/`

| DTO | Purpose |
|-----|---------|
| `ProviderRegistrationDTO` | Signup validation |
| `ProviderLoginDTO` | Auth validation |
| `ProviderResponseDTO` | API response (no password) |
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

### New Files (17)
| Category | Count |
|----------|-------|
| Security Config | 1 |
| Exceptions | 4 |
| Customer DTOs | 4 |
| Provider DTOs | 4 |
| Mappers | 2 |
| Service Interface/Impl | 2 |

### Modified Files (5)
- `GlobalExceptionHandler.java`
- `CustomerRepo.java` (added `findByPhone`)
- `CustomerController.java` (BCrypt integration)
- `ProviderController.java` (BCrypt integration)
- `pom.xml` (validation dependency)

---

## ⚠️ Migration Notes

> **Important**: After this migration, existing users with plain-text passwords cannot login. New registrations required.

---

**Build Status**: ✅ SUCCESS  
**Version**: 1.3.0  
**Last Updated**: December 31, 2025
