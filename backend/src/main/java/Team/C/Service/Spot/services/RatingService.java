package Team.C.Service.Spot.services;

import Team.C.Service.Spot.model.Rating;
import Team.C.Service.Spot.repositery.RatingRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RatingService {
    
    private final RatingRepo ratingRepo;
    
    public Rating createRating(Rating rating) {
        return ratingRepo.save(rating);
    }
    
    public Optional<Rating> getRatingById(Long id) {
        return ratingRepo.findById(id);
    }
    
    public List<Rating> getRatingsByServiceId(Long serviceId) {
        return ratingRepo.findByServiceId(serviceId);
    }
    
    public List<Rating> getRatingsByBookingId(Long bookingId) {
        return ratingRepo.findByBookingId(bookingId);
    }
    
    public List<Rating> getRatingsByCustomerId(Long customerId) {
        return ratingRepo.findByCustomerId(customerId);
    }
    
    public Optional<Rating> getRatingByBookingId(Long bookingId) {
        List<Rating> ratings = ratingRepo.findByBookingId(bookingId);
        return ratings.isEmpty() ? Optional.empty() : Optional.of(ratings.get(0));
    }
    
    public Double getAverageRating(Long serviceId) {
        return ratingRepo.getAverageRatingByServiceId(serviceId);
    }
    
    public Integer getReviewCount(Long serviceId) {
        return ratingRepo.getReviewCountByServiceId(serviceId);
    }
    
    public boolean deleteRating(Long id) {
        if (ratingRepo.existsById(id)) {
            ratingRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
