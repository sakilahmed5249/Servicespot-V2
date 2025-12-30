package Team.C.Service.Spot.controller;

import Team.C.Service.Spot.dto.NotificationRequest;
import Team.C.Service.Spot.model.Contact;
import Team.C.Service.Spot.services.ContactService;
import Team.C.Service.Spot.services.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Slf4j
public class ContactController {

    private final ContactService contactService;
    private final NotificationService notificationService;

    private static final String ADMIN_EMAIL = "admin@servicespot.com";

    @GetMapping
    public ResponseEntity<List<Contact>> getAllMessages() {
        return ResponseEntity.ok(contactService.getAllMessages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMessageById(@PathVariable Long id) {
        return contactService.getMessageById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/unresolved")
    public ResponseEntity<List<Contact>> getUnresolvedMessages() {
        return ResponseEntity.ok(contactService.getUnresolvedMessages());
    }

    @GetMapping("/resolved")
    public ResponseEntity<List<Contact>> getResolvedMessages() {
        return ResponseEntity.ok(contactService.getResolvedMessages());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<List<Contact>> getMessagesByEmail(@PathVariable String email) {
        return ResponseEntity.ok(contactService.getMessagesByEmail(email));
    }

    @PostMapping
    public ResponseEntity<Contact> createMessage(@RequestBody Contact contact) {
        Contact saved = contactService.createMessage(contact);

        // Notify admin about new contact submission
        try {
            String messagePreview = contact.getMessage() != null && contact.getMessage().length() > 50
                    ? contact.getMessage().substring(0, 50) + "..."
                    : contact.getMessage();

            NotificationRequest request = NotificationRequest.builder()
                    .recipientEmail(ADMIN_EMAIL)
                    .recipientRole("ADMIN")
                    .title("New Contact Form Submission")
                    .message("New support request from '" + contact.getName() + "' (" + contact.getEmail() + "): "
                            + messagePreview)
                    .type("CONTACT_FORM_SUBMITTED")
                    .senderName(contact.getName())
                    .priority("NORMAL")
                    .actionUrl("/admin-contacts")
                    .build();

            notificationService.createNotification(request);
            log.info("Admin notified about new contact submission from: {}", contact.getEmail());
        } catch (Exception e) {
            log.warn("Failed to notify admin about contact submission: {}", e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMessage(@PathVariable Long id, @RequestBody Contact contact) {
        Contact updated = contactService.updateMessage(id, contact);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<?> resolveMessage(@PathVariable Long id) {
        Contact resolved = contactService.resolveMessage(id);
        if (resolved != null) {
            return ResponseEntity.ok(resolved);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long id) {
        if (contactService.deleteMessage(id)) {
            return ResponseEntity.ok("Message deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}
