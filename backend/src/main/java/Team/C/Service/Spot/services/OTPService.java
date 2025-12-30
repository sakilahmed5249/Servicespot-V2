package Team.C.Service.Spot.services;

import Team.C.Service.Spot.model.OTP;
import Team.C.Service.Spot.repositery.OTPRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OTPService {

    private final OTPRepo otpRepo;
    private final EmailService emailService;
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 10;

    /**
     * Generate and send OTP for registration
     */
    @Transactional
    public void generateAndSendRegistrationOTP(String email) {
        generateAndSendOTP(email, "REGISTRATION");
    }

    /**
     * Generate and send OTP for password reset
     */
    @Transactional
    public void generateAndSendPasswordResetOTP(String email) {
        generateAndSendOTP(email, "PASSWORD_RESET");
    }

    /**
     * Generate and send OTP
     */
    private void generateAndSendOTP(String email, String otpType) {
        // Delete existing OTPs for this email and type
        otpRepo.deleteByEmailAndOtpType(email, otpType);

        // Generate new OTP
        String otpCode = generateOTPCode();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);

        // Save OTP to database
        OTP otp = OTP.builder()
                .email(email)
                .otp(otpCode)
                .otpType(otpType)
                .verified(false)
                .expiresAt(expiresAt)
                .build();

        otpRepo.save(otp);

        // Send OTP email
        emailService.sendOTPEmail(email, otpCode, otpType);
        
        log.info("OTP generated and sent to: {} for type: {}", email, otpType);
    }

    /**
     * Verify OTP
     */
    @Transactional
    public boolean verifyOTP(String email, String otp, String otpType) {
        Optional<OTP> otpRecord = otpRepo.findByEmailAndOtpAndOtpTypeAndVerifiedFalse(email, otp, otpType);

        if (otpRecord.isEmpty()) {
            log.warn("Invalid OTP attempt for email: {}", email);
            return false;
        }

        OTP otpEntity = otpRecord.get();

        // Check if OTP is expired
        if (otpEntity.getExpiresAt().isBefore(LocalDateTime.now())) {
            log.warn("Expired OTP attempt for email: {}", email);
            return false;
        }

        // Mark as verified
        otpEntity.setVerified(true);
        otpEntity.setVerifiedAt(LocalDateTime.now());
        otpRepo.save(otpEntity);

        log.info("OTP verified successfully for email: {}", email);
        return true;
    }

    /**
     * Check if email has verified OTP
     */
    public boolean hasVerifiedOTP(String email, String otpType) {
        Optional<OTP> otpRecord = otpRepo.findFirstByEmailAndOtpTypeAndVerifiedFalseOrderByCreatedAtDesc(email, otpType);
        
        if (otpRecord.isEmpty()) {
            return false;
        }

        OTP otp = otpRecord.get();
        return otp.getVerified() && otp.getExpiresAt().isAfter(LocalDateTime.now());
    }

    /**
     * Generate random OTP code
     */
    private String generateOTPCode() {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder();
        
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        
        return otp.toString();
    }

    /**
     * Cleanup expired OTPs (runs every hour)
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    @Transactional
    public void cleanupExpiredOTPs() {
        otpRepo.deleteExpiredOTPs(LocalDateTime.now());
        log.info("Cleaned up expired OTPs");
    }
}