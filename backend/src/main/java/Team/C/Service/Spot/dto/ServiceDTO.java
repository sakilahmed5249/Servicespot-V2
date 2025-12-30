package Team.C.Service.Spot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceDTO {
    
    private Long id;
    private String name;
    private String description;
    private Long categoryId;
    private String categoryName;
    private Long providerId;
    private String providerName;
    private Float price;
    private String city;
    private String state;
    private Integer pincode;
    private Double rating;
    private Integer reviewCount;
    private Boolean isActive;
    private Date createdAt;
    private Date updatedAt;
}
