package Team.C.Service.Spot.services;

import Team.C.Service.Spot.model.Booking;
import Team.C.Service.Spot.model.Customer;
import Team.C.Service.Spot.model.Provider;
import Team.C.Service.Spot.repositery.BookingRepo;
import Team.C.Service.Spot.repositery.CustomerRepo;
import Team.C.Service.Spot.repositery.ProviderRepo;
import Team.C.Service.Spot.repositery.ServiceRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepo bookingRepo;
    private final CustomerRepo customerRepo;
    private final ProviderRepo providerRepo;
    private final ServiceRepo serviceRepo;
    
    public Booking createBooking(Booking booking) {
        if (booking == null) {
            throw new IllegalArgumentException("Booking cannot be null");
        }
        
        if ((booking.getCustomer() == null || booking.getCustomer().getId() == null) && 
            (booking.getProviderBooker() == null || booking.getProviderBooker().getId() == null)) {
            throw new IllegalArgumentException("Customer or Provider Booker is required");
        }
        
        if (booking.getProvider() == null || booking.getProvider().getId() == null) {
            throw new IllegalArgumentException("Provider is required");
        }
        
        if (booking.getService() == null || booking.getService().getId() == null) {
            throw new IllegalArgumentException("Service is required");
        }
        
        return bookingRepo.save(booking);
    }
    
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepo.findById(id);
    }
    
    public List<Booking> getCustomerBookings(Long customerId) {
        return bookingRepo.findCustomerBookings(customerId);
    }
    
    public List<Booking> getProviderBookings(Long providerId) {
        return bookingRepo.findProviderBookings(providerId);
    }

    public List<Booking> getProviderMadeBookings(Long providerId) {
        return bookingRepo.findProviderMadeBookings(providerId);
    }
    
    public List<Booking> getServiceBookings(Long serviceId) {
        return bookingRepo.findByServiceId(serviceId);
    }
    
    public List<Booking> getBookingsByStatus(String status) {
        return bookingRepo.findByStatus(status);
    }
    
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }
    
    public Booking updateBooking(Long id, Booking updatedBooking) {
        return bookingRepo.findById(id)
                .map(booking -> {
                    booking.setStatus(updatedBooking.getStatus());
                    booking.setNotes(updatedBooking.getNotes());
                    booking.setBookingDate(updatedBooking.getBookingDate());
                    booking.setBookingTime(updatedBooking.getBookingTime());
                    return bookingRepo.save(booking);
                })
                .orElse(null);
    }

    public Booking updateBookingDirect(Booking booking) {
        return bookingRepo.save(booking);
    }
    
    public Booking cancelBooking(Long id) {
        return bookingRepo.findById(id)
                .map(booking -> {
                    booking.setStatus("Cancelled");
                    booking.setCancelledAt(LocalDateTime.now());
                    return bookingRepo.save(booking);
                })
                .orElse(null);
    }
    
    public Booking completeBooking(Long id) {
        return bookingRepo.findById(id)
                .map(booking -> {
                    booking.setStatus("Completed");
                    booking.setCompletedAt(LocalDateTime.now());
                    return bookingRepo.save(booking);
                })
                .orElse(null);
    }
    
    public boolean deleteBooking(Long id) {
        if (bookingRepo.existsById(id)) {
            bookingRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
