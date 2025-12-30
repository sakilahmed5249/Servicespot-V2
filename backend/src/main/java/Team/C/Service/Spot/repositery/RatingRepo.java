package Team.C.Service.Spot.repositery;

import Team.C.Service.Spot.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepo extends JpaRepository<Rating, Long> {
    
    List<Rating> findByServiceId(Long serviceId);
    
    List<Rating> findByBookingId(Long bookingId);
    
    List<Rating> findByCustomerId(Long customerId);
    
    @Query("SELECT AVG(r.stars) FROM Rating r WHERE r.service.id = :serviceId")
    Double getAverageRatingByServiceId(@Param("serviceId") Long serviceId);
    
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.service.id = :serviceId")
    Integer getReviewCountByServiceId(@Param("serviceId") Long serviceId);
}
