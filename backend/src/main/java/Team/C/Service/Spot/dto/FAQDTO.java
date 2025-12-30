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
public class FAQDTO {
    
    private Long id;
    private String question;
    private String answer;
    private String category;
    private Integer displayOrder;
    private Boolean isActive;
    private Date createdAt;
    private Date updatedAt;
}
