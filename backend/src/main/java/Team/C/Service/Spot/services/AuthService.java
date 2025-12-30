package Team.C.Service.Spot.services;

import Team.C.Service.Spot.dto.AuthResponse;
import Team.C.Service.Spot.dto.CustomerDTO;
import Team.C.Service.Spot.dto.LoginRequest;
import Team.C.Service.Spot.dto.NotificationRequest;
import Team.C.Service.Spot.dto.ProviderDTO;
import Team.C.Service.Spot.model.Customer;
import Team.C.Service.Spot.model.Provider;
import Team.C.Service.Spot.repositery.CustomerRepo;
import Team.C.Service.Spot.repositery.ProviderRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final CustomerRepo customerRepo;
    private final ProviderRepo providerRepo;
    private final OTPService otpService;
    private final NotificationService notificationService;

    // Admin email for notifications
    private static final String ADMIN_EMAIL = "admin@servicespot.com";

    /**
     * Customer Registration with Email Verification
     */
    @Transactional
    public AuthResponse registerCustomer(CustomerDTO dto) {
        // Check if email already exists
        if (customerRepo.findByEmail(dto.getEmail()).isPresent()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email already registered")
                    .build();
        }

        // Create customer (not verified yet)
        Customer customer = Customer.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(dto.getPassword()) // In production, hash this!
                .phone(dto.getPhone())
                .doorNo(dto.getDoorNo())
                .addressLine(dto.getAddressLine())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(dto.getPincode() != null ? Integer.parseInt(dto.getPincode()) : 0)
                .country(dto.getCountry())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .verified(false)
                .emailVerified(false)
                .role("CUSTOMER")
                .build();

        Customer saved = customerRepo.save(customer);

        // Send OTP for email verification
        otpService.generateAndSendRegistrationOTP(saved.getEmail());

        // Notify admin about new customer registration
        try {
            NotificationRequest request = NotificationRequest.builder()
                    .recipientEmail(ADMIN_EMAIL)
                    .recipientRole("ADMIN")
                    .title("New Customer Registered")
                    .message("New customer '" + saved.getName() + "' (" + saved.getEmail()
                            + ") has registered and needs verification.")
                    .type("NEW_CUSTOMER_REGISTERED")
                    .senderName(saved.getName())
                    .priority("NORMAL")
                    .actionUrl("/admin-customers")
                    .build();

            notificationService.createNotification(request);
            log.info("Admin notified about new customer: {}", saved.getEmail());
        } catch (Exception e) {
            log.warn("Failed to notify admin about new customer: {}", e.getMessage());
        }

        return AuthResponse.builder()
                .success(true)
                .message("Registration successful. Please verify your email with the OTP sent.")
                .userId(saved.getId())
                .email(saved.getEmail())
                .name(saved.getName())
                .role("CUSTOMER")
                .emailVerified(false)
                .build();
    }

    /**
     * Provider Registration with Email Verification
     */
    @Transactional
    public AuthResponse registerProvider(ProviderDTO dto) {
        // Check if email already exists
        if (providerRepo.findByEmail(dto.getEmail()).isPresent()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email already registered")
                    .build();
        }

        // Create provider (not verified yet)
        Provider provider = Provider.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(dto.getPassword()) // In production, hash this!
                .phone(dto.getPhone())
                .doorNo(dto.getDoorNo())
                .addressLine(dto.getAddressLine())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(dto.getPincode())
                .country(dto.getCountry())
                .serviceType(dto.getServiceType())
                .price(dto.getPrice() != null ? dto.getPrice() : 0.0f)
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .verified(false)
                .emailVerified(false)
                .role("PROVIDER")
                .build();

        Provider saved = providerRepo.save(provider);

        // Send OTP for email verification
        otpService.generateAndSendRegistrationOTP(saved.getEmail());

        // Notify admin about new provider registration
        try {
            NotificationRequest request = NotificationRequest.builder()
                    .recipientEmail(ADMIN_EMAIL)
                    .recipientRole("ADMIN")
                    .title("New Provider Registered")
                    .message("New provider '" + saved.getName() + "' (" + saved.getEmail()
                            + ") has registered. Service: " + saved.getServiceType() + ". Please verify.")
                    .type("NEW_PROVIDER_REGISTERED")
                    .senderName(saved.getName())
                    .priority("HIGH")
                    .actionUrl("/admin-providers")
                    .build();

            notificationService.createNotification(request);
            log.info("Admin notified about new provider: {}", saved.getEmail());
        } catch (Exception e) {
            log.warn("Failed to notify admin about new provider: {}", e.getMessage());
        }

        return AuthResponse.builder()
                .success(true)
                .message("Registration successful. Please verify your email with the OTP sent.")
                .userId(saved.getId())
                .email(saved.getEmail())
                .name(saved.getName())
                .role("PROVIDER")
                .emailVerified(false)
                .build();
    }

    /**
     * Verify Email OTP after Registration
     */
    @Transactional
    public AuthResponse verifyEmailOTP(String email, String otp) {
        // Verify OTP
        boolean verified = otpService.verifyOTP(email, otp, "REGISTRATION");

        if (!verified) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Invalid or expired OTP")
                    .build();
        }

        // Update customer or provider email verification status
        Optional<Customer> customer = customerRepo.findByEmail(email);
        if (customer.isPresent()) {
            Customer c = customer.get();
            c.setEmailVerified(true);
            customerRepo.save(c);

            return AuthResponse.builder()
                    .success(true)
                    .message("Email verified successfully! You can now login.")
                    .userId(c.getId())
                    .email(c.getEmail())
                    .name(c.getName())
                    .role("CUSTOMER")
                    .emailVerified(true)
                    .build();
        }

        Optional<Provider> provider = providerRepo.findByEmail(email);
        if (provider.isPresent()) {
            Provider p = provider.get();
            p.setEmailVerified(true);
            providerRepo.save(p);

            return AuthResponse.builder()
                    .success(true)
                    .message("Email verified successfully! You can now login.")
                    .userId(p.getId())
                    .email(p.getEmail())
                    .name(p.getName())
                    .role("PROVIDER")
                    .emailVerified(true)
                    .build();
        }

        return AuthResponse.builder()
                .success(false)
                .message("User not found")
                .build();
    }

    /**
     * Login (requires email verification)
     */
    public AuthResponse login(LoginRequest request) {
        // Try customer login
        Optional<Customer> customer = customerRepo.findByEmail(request.getEmail());
        if (customer.isPresent()) {
            Customer c = customer.get();

            if (!c.getPassword().equals(request.getPassword())) {
                return AuthResponse.builder()
                        .success(false)
                        .message("Invalid credentials")
                        .build();
            }

            if (!c.getEmailVerified()) {
                return AuthResponse.builder()
                        .success(false)
                        .message("Please verify your email first. Check your inbox for OTP.")
                        .userId(c.getId())
                        .email(c.getEmail())
                        .emailVerified(false)
                        .build();
            }

            return AuthResponse.builder()
                    .success(true)
                    .message("Login successful")
                    .userId(c.getId())
                    .email(c.getEmail())
                    .name(c.getName())
                    .role("CUSTOMER")
                    .emailVerified(true)
                    .build();
        }

        // Try provider login
        Optional<Provider> provider = providerRepo.findByEmail(request.getEmail());
        if (provider.isPresent()) {
            Provider p = provider.get();

            if (!p.getPassword().equals(request.getPassword())) {
                return AuthResponse.builder()
                        .success(false)
                        .message("Invalid credentials")
                        .build();
            }

            if (!p.getEmailVerified()) {
                return AuthResponse.builder()
                        .success(false)
                        .message("Please verify your email first. Check your inbox for OTP.")
                        .userId(p.getId())
                        .email(p.getEmail())
                        .emailVerified(false)
                        .build();
            }

            return AuthResponse.builder()
                    .success(true)
                    .message("Login successful")
                    .userId(p.getId())
                    .email(p.getEmail())
                    .name(p.getName())
                    .role("PROVIDER")
                    .emailVerified(true)
                    .build();
        }

        return AuthResponse.builder()
                .success(false)
                .message("Invalid credentials")
                .build();
    }

    /**
     * Forgot Password - Send OTP
     */
    public AuthResponse sendPasswordResetOTP(String email) {
        // Check if user exists
        boolean userExists = customerRepo.findByEmail(email).isPresent() ||
                providerRepo.findByEmail(email).isPresent();

        if (!userExists) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email not registered")
                    .build();
        }

        // Send password reset OTP
        otpService.generateAndSendPasswordResetOTP(email);

        return AuthResponse.builder()
                .success(true)
                .message("Password reset OTP sent to your email")
                .build();
    }

    /**
     * Reset Password with OTP
     */
    @Transactional
    public AuthResponse resetPassword(String email, String otp, String newPassword) {
        // Verify OTP
        boolean verified = otpService.verifyOTP(email, otp, "PASSWORD_RESET");

        if (!verified) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Invalid or expired OTP")
                    .build();
        }

        // Update password for customer or provider
        Optional<Customer> customer = customerRepo.findByEmail(email);
        if (customer.isPresent()) {
            Customer c = customer.get();
            c.setPassword(newPassword); // In production, hash this!
            customerRepo.save(c);

            return AuthResponse.builder()
                    .success(true)
                    .message("Password reset successful. You can now login with your new password.")
                    .build();
        }

        Optional<Provider> provider = providerRepo.findByEmail(email);
        if (provider.isPresent()) {
            Provider p = provider.get();
            p.setPassword(newPassword); // In production, hash this!
            providerRepo.save(p);

            return AuthResponse.builder()
                    .success(true)
                    .message("Password reset successful. You can now login with your new password.")
                    .build();
        }

        return AuthResponse.builder()
                .success(false)
                .message("User not found")
                .build();
    }

    /**
     * Resend OTP
     */
    public AuthResponse resendOTP(String email, String otpType) {
        if (otpType.equals("REGISTRATION")) {
            otpService.generateAndSendRegistrationOTP(email);
        } else if (otpType.equals("PASSWORD_RESET")) {
            otpService.generateAndSendPasswordResetOTP(email);
        } else {
            return AuthResponse.builder()
                    .success(false)
                    .message("Invalid OTP type")
                    .build();
        }

        return AuthResponse.builder()
                .success(true)
                .message("OTP resent successfully")
                .build();
    }
}