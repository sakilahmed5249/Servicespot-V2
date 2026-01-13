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
import org.springframework.transaction.annotation.Transactional;

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
    private final NotificationService notificationService;
    
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

    @Transactional
    public Booking updateStatus(Long id, String newStatus) {
        return bookingRepo.findById(id).map(booking -> {
            String oldStatus = booking.getStatus();
            booking.setStatus(newStatus);

            if ("Accepted".equalsIgnoreCase(newStatus) && !newStatus.equalsIgnoreCase(oldStatus)) {
                booking.setAcceptedAt(LocalDateTime.now());
                String customerEmail = null;
                if (booking.getCustomer() != null) {
                    customerEmail = booking.getCustomer().getEmail();
                } else if (booking.getProviderBooker() != null) {
                    customerEmail = booking.getProviderBooker().getEmail();
                }

                if (customerEmail != null && booking.getProvider() != null) {
                    notificationService.notifyBookingAccepted(
                            customerEmail,
                            booking.getProvider().getName(),
                            booking.getId(),
                            booking.getServiceName(),
                            booking.getBookingDate(),
                            booking.getBookingTime());
                }
            }

            if ("Confirmed".equalsIgnoreCase(newStatus) && !newStatus.equalsIgnoreCase(oldStatus)) {
                if (booking.getCustomer() != null && booking.getProvider() != null) {
                    notificationService.notifyBookingConfirmed(
                            booking.getCustomer().getEmail(),
                            booking.getProvider().getName(),
                            booking.getId(),
                            booking.getServiceName());
                }
            }

            if ("En Route".equalsIgnoreCase(newStatus) && !newStatus.equalsIgnoreCase(oldStatus)) {
                booking.setEnRouteAt(LocalDateTime.now());
                String customerEmail = booking.getCustomer() != null ? booking.getCustomer().getEmail() : 
                                     (booking.getProviderBooker() != null ? booking.getProviderBooker().getEmail() : null);
                if (customerEmail != null && booking.getProvider() != null) {
                    notificationService.notifyProviderEnRoute(customerEmail, booking.getProvider().getName(), booking.getId(), booking.getServiceName());
                }
            }

            if ("In Progress".equalsIgnoreCase(newStatus) && !newStatus.equalsIgnoreCase(oldStatus)) {
                booking.setInProgressAt(LocalDateTime.now());
                String customerEmail = booking.getCustomer() != null ? booking.getCustomer().getEmail() : 
                                     (booking.getProviderBooker() != null ? booking.getProviderBooker().getEmail() : null);
                if (customerEmail != null && booking.getProvider() != null) {
                    notificationService.notifyServiceInProgress(customerEmail, booking.getProvider().getName(), booking.getId(), booking.getServiceName());
                }
            }

            return bookingRepo.save(booking);
        }).orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
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
