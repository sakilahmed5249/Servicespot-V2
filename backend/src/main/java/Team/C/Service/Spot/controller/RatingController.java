package Team.C.Service.Spot.controller;

import Team.C.Service.Spot.model.Rating;
import Team.C.Service.Spot.model.Booking;
import Team.C.Service.Spot.model.Service;
import Team.C.Service.Spot.model.Customer;
import Team.C.Service.Spot.services.RatingService;
import Team.C.Service.Spot.services.BookingService;
import Team.C.Service.Spot.services.ServiceService;
import Team.C.Service.Spot.services.NotificationService;
import Team.C.Service.Spot.repositery.CustomerRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rating")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Slf4j
public class RatingController {

    private final RatingService ratingService;
    private final BookingService bookingService;
    private final ServiceService serviceService;
    private final CustomerRepo customerRepo;
    private final NotificationService notificationService;

    private Object convertToDTO(Rating rating) {
        if (rating == null)
            return null;

        return new HashMap<String, Object>() {
            {
                put("id", rating.getId());
                put("stars", rating.getStars());
                put("review", rating.getReview());
                put("createdAt", rating.getCreatedAt());
                put("customerName", rating.getCustomer() != null ? rating.getCustomer().getName() : null);
                put("serviceName", rating.getService() != null ? rating.getService().getName() : null);
                put("bookingId", rating.getBooking() != null ? rating.getBooking().getId() : null);
                put("serviceId", rating.getService() != null ? rating.getService().getId() : null);
            }
        };
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRating(@RequestBody Map<String, Object> ratingData) {
        try {
            Long bookingId = ((Number) ratingData.get("bookingId")).longValue();
            Double stars = ((Number) ratingData.get("stars")).doubleValue();
            String review = (String) ratingData.get("review");

            if (stars < 1 || stars > 5) {
                return ResponseEntity.badRequest().body("Stars must be between 1 and 5");
            }

            Optional<Booking> booking = bookingService.getBookingById(bookingId);
            if (!booking.isPresent()) {
                return ResponseEntity.badRequest().body("Booking not found");
            }

            Booking b = booking.get();

            Optional<Rating> existingRating = ratingService.getRatingByBookingId(bookingId);
            if (existingRating.isPresent()) {
                return ResponseEntity.badRequest().body("This booking has already been rated");
            }

            Rating rating = Rating.builder()
                    .booking(b)
                    .service(b.getService())
                    .customer(b.getCustomer())
                    .stars(stars)
                    .review(review)
                    .build();

            Rating created = ratingService.createRating(rating);

            Double avgRating = ratingService.getAverageRating(b.getService().getId());
            Integer reviewCount = ratingService.getReviewCount(b.getService().getId());

            b.getService().setRating(avgRating != null ? avgRating : 0.0);
            b.getService().setReviewCount(reviewCount != null ? reviewCount : 0);
            serviceService.createService(b.getService());

            // Send notification to provider
            try {
                if (b.getService() != null && b.getService().getProvider() != null && b.getCustomer() != null) {
                    String providerEmail = b.getService().getProvider().getEmail();
                    String customerName = b.getCustomer().getName();
                    int ratingStars = stars.intValue();
                    String serviceName = b.getService().getName();

                    log.info("=== SENDING REVIEW NOTIFICATION ===");
                    log.info("Provider: {}, Customer: {}, Rating: {}, Service: {}",
                            providerEmail, customerName, ratingStars, serviceName);

                    notificationService.notifyReviewReceived(
                            providerEmail,
                            customerName,
                            created.getId(),
                            ratingStars,
                            serviceName);

                    log.info("=== NOTIFICATION SENT ===");
                }
            } catch (Exception e) {
                log.error("Error sending notification", e);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating rating: " + e.getMessage());
        }
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<?>> getRatingsByService(@PathVariable Long serviceId) {
        List<?> ratings = ratingService.getRatingsByServiceId(serviceId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ratings);
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getRatingByBooking(@PathVariable Long bookingId) {
        Optional<Rating> rating = ratingService.getRatingByBookingId(bookingId);
        if (rating.isPresent()) {
            return ResponseEntity.ok(convertToDTO(rating.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/service/{serviceId}/average")
    public ResponseEntity<?> getAverageRating(@PathVariable Long serviceId) {
        Double avgRating = ratingService.getAverageRating(serviceId);
        Integer reviewCount = ratingService.getReviewCount(serviceId);

        return ResponseEntity.ok(new HashMap<String, Object>() {
            {
                put("averageRating", avgRating != null ? avgRating : 0.0);
                put("reviewCount", reviewCount != null ? reviewCount : 0);
            }
        });
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRating(@PathVariable Long id) {
        if (ratingService.deleteRating(id)) {
            return ResponseEntity.ok("Rating deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}
