package Team.C.Service.Spot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    private Long id;
    private String title;
    private String message;
    private String type;
    private Boolean isRead;
    private Long relatedEntityId;
    private String relatedEntityType;
    private String actionUrl;
    private String senderName;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
    private String priority;
}

