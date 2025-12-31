package Team.C.Service.Spot.dto.provider;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for provider API responses - NO PASSWORD FIELD for security
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String doorNo;
    private String addressLine;
    private String city;
    private String state;
    private Integer pincode;
    private String country;
    private String serviceType;
    private Float price;
    private Double latitude;
    private Double longitude;
    private Boolean verified;
    private String role;
    private String profileImage; // Base64 encoded
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // NOTE: Password is intentionally NOT included for security
}
