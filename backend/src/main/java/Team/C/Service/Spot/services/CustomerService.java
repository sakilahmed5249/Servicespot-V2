package Team.C.Service.Spot.services;

import org.springframework.stereotype.Service;
import Team.C.Service.Spot.model.Customer;
import Team.C.Service.Spot.repositery.CustomerRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerService {

    private final CustomerRepo customerRepo;
    private final NotificationService notificationService;

    public Customer signup(Customer customer) {
        return customerRepo.save(customer);
    }

    public Boolean login(String email, String password) {
        return customerRepo.findByEmail(email)
                .map(c -> c.getPassword().equals(password))
                .orElse(false);
    }

    public List<Customer> getAllCustomers() {
        return customerRepo.findAll();
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepo.findById(id);
    }

    public Optional<Customer> getCustomerByEmail(String email) {
        return customerRepo.findByEmail(email);
    }

    public Customer updateCustomer(Long id, Customer updatedCustomer) {
        return customerRepo.findById(id)
                .map(existing -> {
                    // Track email change for notification migration
                    String oldEmail = existing.getEmail();
                    String newEmail = updatedCustomer.getEmail();
                    boolean emailChanged = newEmail != null && !newEmail.equals(oldEmail);

                    if (updatedCustomer.getName() != null) {
                        existing.setName(updatedCustomer.getName());
                    }
                    if (updatedCustomer.getEmail() != null) {
                        existing.setEmail(updatedCustomer.getEmail());
                    }
                    if (updatedCustomer.getPassword() != null) {
                        existing.setPassword(updatedCustomer.getPassword());
                    }
                    if (updatedCustomer.getPhone() != null) {
                        existing.setPhone(updatedCustomer.getPhone());
                    }
                    if (updatedCustomer.getDoorNo() != null) {
                        existing.setDoorNo(updatedCustomer.getDoorNo());
                    }
                    if (updatedCustomer.getAddressLine() != null) {
                        existing.setAddressLine(updatedCustomer.getAddressLine());
                    }
                    if (updatedCustomer.getCity() != null) {
                        existing.setCity(updatedCustomer.getCity());
                    }
                    if (updatedCustomer.getState() != null) {
                        existing.setState(updatedCustomer.getState());
                    }
                    if (updatedCustomer.getPincode() != null) {
                        existing.setPincode(updatedCustomer.getPincode());
                    }
                    if (updatedCustomer.getCountry() != null) {
                        existing.setCountry(updatedCustomer.getCountry());
                    }
                    if (updatedCustomer.getLatitude() != null) {
                        existing.setLatitude(updatedCustomer.getLatitude());
                    }
                    if (updatedCustomer.getLongitude() != null) {
                        existing.setLongitude(updatedCustomer.getLongitude());
                    }
                    if (updatedCustomer.getVerified() != null) {
                        existing.setVerified(updatedCustomer.getVerified());
                    }
                    if (updatedCustomer.getProfileImage() != null) {
                        existing.setProfileImage(updatedCustomer.getProfileImage());
                    }

                    Customer saved = customerRepo.save(existing);

                    // Migrate notifications if email changed
                    if (emailChanged) {
                        notificationService.updateRecipientEmail(oldEmail, newEmail);
                        log.info("Migrated notifications for customer from {} to {}", oldEmail, newEmail);
                    }

                    return saved;
                })
                .orElse(null);
    }

    public Customer updatePassword(Long id, String newPassword) {
        return customerRepo.findById(id)
                .map(c -> {
                    c.setPassword(newPassword);
                    return customerRepo.save(c);
                })
                .orElse(null);
    }

    public void deleteCustomer(Long id) {
        customerRepo.deleteById(id);
    }
}
