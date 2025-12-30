package Team.C.Service.Spot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {

    private String recipientEmail;
    private String recipientRole;
    private String title;
    private String message;
    private String type;
    private Long relatedEntityId;
    private String relatedEntityType;
    private String actionUrl;
    private String senderName;
    private String priority;
}

