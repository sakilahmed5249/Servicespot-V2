package Team.C.Service.Spot.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResendOTPRequest {
    private String email;
    private String otpType; // REGISTRATION or PASSWORD_RESET
}