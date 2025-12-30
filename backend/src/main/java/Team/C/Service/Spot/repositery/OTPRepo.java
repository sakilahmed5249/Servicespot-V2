package Team.C.Service.Spot.repositery;

import Team.C.Service.Spot.model.OTP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OTPRepo extends JpaRepository<OTP, Long> {
    
    Optional<OTP> findByEmailAndOtpAndOtpTypeAndVerifiedFalse(String email, String otp, String otpType);
    
    Optional<OTP> findFirstByEmailAndOtpTypeAndVerifiedFalseOrderByCreatedAtDesc(String email, String otpType);
    
    @Modifying
    @Query("DELETE FROM OTP o WHERE o.expiresAt < :now")
    void deleteExpiredOTPs(@Param("now") LocalDateTime now);
    
    @Modifying
    @Query("DELETE FROM OTP o WHERE o.email = :email AND o.otpType = :otpType")
    void deleteByEmailAndOtpType(@Param("email") String email, @Param("otpType") String otpType);
}