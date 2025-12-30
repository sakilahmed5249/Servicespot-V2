package Team.C.Service.Spot.repositery;

import Team.C.Service.Spot.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepo extends JpaRepository<Booking, Long> {
    
    List<Booking> findByCustomerId(Long customerId);
    
    List<Booking> findByProviderId(Long providerId);
    
    List<Booking> findByServiceId(Long serviceId);
    
    @Query("SELECT b FROM Booking b WHERE b.customer.id = :customerId ORDER BY b.createdAt DESC")
    List<Booking> findCustomerBookings(@Param("customerId") Long customerId);
    
    @Query("SELECT b FROM Booking b WHERE b.provider.id = :providerId ORDER BY b.createdAt DESC")
    List<Booking> findProviderBookings(@Param("providerId") Long providerId);

    @Query("SELECT b FROM Booking b WHERE b.providerBooker.id = :providerId ORDER BY b.createdAt DESC")
    List<Booking> findProviderMadeBookings(@Param("providerId") Long providerId);
    
    @Query("SELECT b FROM Booking b WHERE b.status = :status ORDER BY b.createdAt DESC")
    List<Booking> findByStatus(@Param("status") String status);
    
    Optional<Booking> findById(Long id);
}
