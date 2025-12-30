package Team.C.Service.Spot.controller;

import Team.C.Service.Spot.model.FAQ;
import Team.C.Service.Spot.services.FAQService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faq")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class FAQController {
    
    private final FAQService faqService;
    
    @GetMapping
    public ResponseEntity<List<FAQ>> getAllFAQs() {
        return ResponseEntity.ok(faqService.getAllFAQs());
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<FAQ>> getActiveFAQs() {
        return ResponseEntity.ok(faqService.getActiveFAQs());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getFAQById(@PathVariable Long id) {
        return faqService.getFAQById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<FAQ>> getFAQsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(faqService.getFAQsByCategory(category));
    }
    
    @PostMapping
    public ResponseEntity<FAQ> createFAQ(@RequestBody FAQ faq) {
        return ResponseEntity.status(HttpStatus.CREATED).body(faqService.createFAQ(faq));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateFAQ(@PathVariable Long id, @RequestBody FAQ faq) {
        FAQ updated = faqService.updateFAQ(id, faq);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/activate")
    public ResponseEntity<?> activateFAQ(@PathVariable Long id) {
        FAQ activated = faqService.activateFAQ(id);
        if (activated != null) {
            return ResponseEntity.ok(activated);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateFAQ(@PathVariable Long id) {
        FAQ deactivated = faqService.deactivateFAQ(id);
        if (deactivated != null) {
            return ResponseEntity.ok(deactivated);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFAQ(@PathVariable Long id) {
        if (faqService.deleteFAQ(id)) {
            return ResponseEntity.ok("FAQ deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}
