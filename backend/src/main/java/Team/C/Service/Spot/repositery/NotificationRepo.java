package Team.C.Service.Spot.repositery;

import Team.C.Service.Spot.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepo extends JpaRepository<Notification, Long> {

    // Find all notifications for a specific user
    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(String recipientEmail);

    // Find unread notifications for a specific user
    List<Notification> findByRecipientEmailAndIsReadFalseOrderByCreatedAtDesc(String recipientEmail);

    // Count unread notifications for a user
    Long countByRecipientEmailAndIsReadFalse(String recipientEmail);

    // Find notifications by type for a user
    List<Notification> findByRecipientEmailAndTypeOrderByCreatedAtDesc(String recipientEmail, String type);

    // Find notifications by priority for a user
    List<Notification> findByRecipientEmailAndPriorityOrderByCreatedAtDesc(String recipientEmail, String priority);

    // Find recent notifications (last N days)
    @Query("SELECT n FROM Notification n WHERE n.recipientEmail = :email AND n.createdAt >= :since ORDER BY n.createdAt DESC")
    List<Notification> findRecentNotifications(@Param("email") String email, @Param("since") LocalDateTime since);

    // Mark all notifications as read for a user
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = :readAt WHERE n.recipientEmail = :email AND n.isRead = false")
    int markAllAsRead(@Param("email") String email, @Param("readAt") LocalDateTime readAt);

    // Delete old read notifications (cleanup)
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.isRead = true AND n.createdAt < :before")
    int deleteOldReadNotifications(@Param("before") LocalDateTime before);

    // Find notifications related to a specific entity
    List<Notification> findByRelatedEntityIdAndRelatedEntityType(Long entityId, String entityType);
}

