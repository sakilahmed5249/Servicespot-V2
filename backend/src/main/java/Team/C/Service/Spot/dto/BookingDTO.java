package Team.C.Service.Spot.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long customerId;
    private Long providerBookerId;
    private Long providerId;
    private Long serviceId;
    private String serviceName;
    private String bookingDate;
    private String bookingTime;
    private String notes;
    private String status;
    private BigDecimal totalAmount;
}
