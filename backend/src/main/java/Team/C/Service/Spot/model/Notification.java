package Team.C.Service.Spot.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String recipientEmail; // Email of the user receiving the notification

    @Column(nullable = false)
    private String recipientRole; // ADMIN, CUSTOMER, or SERVICE_PROVIDER

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(nullable = false)
    private String type; // BOOKING_CREATED, BOOKING_CONFIRMED, BOOKING_CANCELLED, BOOKING_COMPLETED, REVIEW_RECEIVED, etc.

    @Column(nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    @Column
    private Long relatedEntityId; // ID of related booking, review, etc.

    @Column
    private String relatedEntityType; // BOOKING, REVIEW, SERVICE, etc.

    @Column
    private String actionUrl; // URL to navigate when notification is clicked

    @Column
    private String senderName; // Name of the person who triggered this notification

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime readAt;

    @Column
    @Builder.Default
    private String priority = "NORMAL"; // HIGH, NORMAL, LOW
}

