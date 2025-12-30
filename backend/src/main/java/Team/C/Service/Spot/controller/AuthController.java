package Team.C.Service.Spot.controller;

import Team.C.Service.Spot.dto.*;
import Team.C.Service.Spot.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    /**
     * Customer Registration
     * POST /api/auth/register/customer
     */
    @PostMapping("/register/customer")
    public ResponseEntity<AuthResponse> registerCustomer(@RequestBody CustomerDTO request) {
        return ResponseEntity.ok(authService.registerCustomer(request));
    }

    /**
     * Provider Registration
     * POST /api/auth/register/provider
     */
    @PostMapping("/register/provider")
    public ResponseEntity<AuthResponse> registerProvider(@RequestBody ProviderDTO request) {
        return ResponseEntity.ok(authService.registerProvider(request));
    }

    /**
     * Verify Email OTP
     * POST /api/auth/verify-email
     * Body: { "email": "user@example.com", "otp": "123456" }
     */
    @PostMapping("/verify-email")
    public ResponseEntity<AuthResponse> verifyEmail(@RequestBody OTPRequest request) {
        return ResponseEntity.ok(authService.verifyEmailOTP(request.getEmail(), request.getOtp()));
    }

    /**
     * Login
     * POST /api/auth/login
     * Body: { "email": "user@example.com", "password": "password123" }
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * Forgot Password - Send OTP
     * POST /api/auth/forgot-password
     * Body: { "email": "user@example.com" }
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.sendPasswordResetOTP(request.getEmail()));
    }

    /**
     * Reset Password with OTP
     * POST /api/auth/reset-password
     * Body: { "email": "user@example.com", "otp": "123456", "newPassword": "newpass123" }
     */
    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(
            request.getEmail(), 
            request.getOtp(), 
            request.getNewPassword()
        ));
    }

    /**
     * Resend OTP
     * POST /api/auth/resend-otp
     * Body: { "email": "user@example.com", "otpType": "REGISTRATION" }
     */
    @PostMapping("/resend-otp")
    public ResponseEntity<AuthResponse> resendOTP(@RequestBody ResendOTPRequest request) {
        return ResponseEntity.ok(authService.resendOTP(request.getEmail(), request.getOtpType()));
    }
}