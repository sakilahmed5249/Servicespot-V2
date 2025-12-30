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
public class ContactDTO {
    
    private Long id;
    private String name;
    private String email;
    private String subject;
    private String message;
    private String phone;
    private Boolean isResolved;
    private Date createdAt;
    private Date updatedAt;
}
