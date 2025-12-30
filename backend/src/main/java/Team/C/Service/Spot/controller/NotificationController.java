package Team.C.Service.Spot.controller;

import Team.C.Service.Spot.dto.NotificationDTO;
import Team.C.Service.Spot.dto.NotificationRequest;
import Team.C.Service.Spot.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Create a new notification
     */
    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationRequest request) {
        NotificationDTO notification = notificationService.createNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(notification);
    }

    /**
     * Get all notifications for a user
     */
    @GetMapping("/user/{email}")
    public ResponseEntity<List<NotificationDTO>> getUserNotifications(@PathVariable String email) {
        List<NotificationDTO> notifications = notificationService.getUserNotifications(email);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get unread notifications for a user
     */
    @GetMapping("/user/{email}/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(@PathVariable String email) {
        List<NotificationDTO> notifications = notificationService.getUnreadNotifications(email);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get unread notification count
     */
    @GetMapping("/user/{email}/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable String email) {
        Long count = notificationService.getUnreadCount(email);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    /**
     * Get recent notifications (last N days)
     */
    @GetMapping("/user/{email}/recent")
    public ResponseEntity<List<NotificationDTO>> getRecentNotifications(
            @PathVariable String email,
            @RequestParam(defaultValue = "7") int days) {
        List<NotificationDTO> notifications = notificationService.getRecentNotifications(email, days);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Mark a notification as read
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationDTO> markAsRead(@PathVariable Long id) {
        NotificationDTO notification = notificationService.markAsRead(id);
        return ResponseEntity.ok(notification);
    }

    /**
     * Mark all notifications as read for a user
     */
    @PutMapping("/user/{email}/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(@PathVariable String email) {
        int count = notificationService.markAllAsRead(email);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("markedCount", count);
        response.put("message", count + " notifications marked as read");
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a notification
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        Map<String, String> response = new HashMap<>();
        response.put("success", "true");
        response.put("message", "Notification deleted successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * Cleanup old notifications (admin only)
     */
    @DeleteMapping("/cleanup")
    public ResponseEntity<Map<String, Object>> cleanupOldNotifications(
            @RequestParam(defaultValue = "30") int daysOld) {
        int count = notificationService.cleanupOldNotifications(daysOld);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("deletedCount", count);
        response.put("message", count + " old notifications deleted");
        return ResponseEntity.ok(response);
    }
}

