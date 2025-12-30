package Team.C.Service.Spot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDTO {
    
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String doorNo;
    private String addressLine;
    private String city;
    private String state;
    private String pincode;
    private String country;
    private Double latitude;
    private Double longitude;
    private Boolean verified;
    private String password;
    private String profileImage;
}
