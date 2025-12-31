package Team.C.Service.Spot.dto.provider;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for provider profile updates - all fields optional
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderUpdateDTO {

    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be exactly 10 digits")
    private String phone;

    private String doorNo;

    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String addressLine;

    private String city;

    private String state;

    @Min(value = 100000, message = "Pincode must be 6 digits")
    @Max(value = 999999, message = "Pincode must be 6 digits")
    private Integer pincode;

    private String country;

    @Size(min = 2, max = 100, message = "Service type must be between 2 and 100 characters")
    private String serviceType;

    @DecimalMin(value = "0.0", message = "Price must be zero or positive")
    private Float price;

    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    private Double latitude;

    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    private Double longitude;

    private String profileImage; // Base64 encoded
}
