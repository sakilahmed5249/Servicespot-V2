package Team.C.Service.Spot.services;

import Team.C.Service.Spot.model.Admin;
import Team.C.Service.Spot.model.Customer;
import Team.C.Service.Spot.model.Provider;
import Team.C.Service.Spot.repositery.AdminRepo;
import Team.C.Service.Spot.repositery.CustomerRepo;
import Team.C.Service.Spot.repositery.ProviderRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminService {
    
    private final AdminRepo adminRepo;
    private final CustomerRepo customerRepo;
    private final ProviderRepo providerRepo;
    
    public Optional<Admin> findByEmail(String email) {
        return adminRepo.findByEmail(email);
    }
    
    public Admin authenticateAdmin(String email, String password) {
        Optional<Admin> admin = adminRepo.findByEmail(email);
        if (admin.isPresent() && admin.get().getPassword().equals(password)) {
            return admin.get();
        }
        
        Optional<Customer> customer = customerRepo.findByEmail(email);
        if (customer.isPresent() && customer.get().getRole() != null && 
            customer.get().getRole().equals("ADMIN") && 
            customer.get().getPassword().equals(password)) {
            Admin adminFromCustomer = Admin.builder()
                    .id(customer.get().getId())
                    .name(customer.get().getName())
                    .email(customer.get().getEmail())
                    .password(customer.get().getPassword())
                    .role("ADMIN")
                    .build();
            return adminFromCustomer;
        }
        
        Optional<Provider> provider = providerRepo.findByEmail(email);
        if (provider.isPresent() && provider.get().getRole() != null && 
            provider.get().getRole().equals("ADMIN") && 
            provider.get().getPassword().equals(password)) {
            Admin adminFromProvider = Admin.builder()
                    .id(provider.get().getId())
                    .name(provider.get().getName())
                    .email(provider.get().getEmail())
                    .password(provider.get().getPassword())
                    .role("ADMIN")
                    .build();
            return adminFromProvider;
        }
        
        return null;
    }
    
    public Admin createDefaultAdmin() {
        Optional<Admin> existing = adminRepo.findByEmail("admin@servicespot.com");
        if (existing.isPresent()) {
            return existing.get();
        }
        
        Admin admin = Admin.builder()
                .name("Admin")
                .email("admin@servicespot.com")
                .password("admin123")
                .role("ADMIN")
                .build();
        
        return adminRepo.save(admin);
    }
    
    public List<Customer> getAllCustomers() {
        return customerRepo.findAll();
    }
    
    public List<Provider> getAllProviders() {
        return providerRepo.findAll();
    }
    
    public Customer promoteCustomerToAdmin(Long customerId) {
        Optional<Customer> customer = customerRepo.findById(customerId);
        if (customer.isPresent()) {
            Customer cust = customer.get();
            cust.setRole("ADMIN");
            return customerRepo.save(cust);
        }
        return null;
    }
    
    public Provider promoteProviderToAdmin(Long providerId) {
        Optional<Provider> provider = providerRepo.findById(providerId);
        if (provider.isPresent()) {
            Provider prov = provider.get();
            prov.setRole("ADMIN");
            return providerRepo.save(prov);
        }
        return null;
    }
    
    public Customer demoteAdminToCustomer(Long customerId) {
        Optional<Customer> customer = customerRepo.findById(customerId);
        if (customer.isPresent()) {
            Customer cust = customer.get();
            cust.setRole("CUSTOMER");
            return customerRepo.save(cust);
        }
        return null;
    }
    
    public Provider demoteAdminToProvider(Long providerId) {
        Optional<Provider> provider = providerRepo.findById(providerId);
        if (provider.isPresent()) {
            Provider prov = provider.get();
            prov.setRole("PROVIDER");
            return providerRepo.save(prov);
        }
        return null;
    }
    
    public Customer verifyCustomer(Long customerId) {
        Optional<Customer> customer = customerRepo.findById(customerId);
        if (customer.isPresent()) {
            Customer cust = customer.get();
            cust.setVerified(true);
            return customerRepo.save(cust);
        }
        return null;
    }
    
    public Customer unverifyCustomer(Long customerId) {
        Optional<Customer> customer = customerRepo.findById(customerId);
        if (customer.isPresent()) {
            Customer cust = customer.get();
            cust.setVerified(false);
            return customerRepo.save(cust);
        }
        return null;
    }
    
    public Provider verifyProvider(Long providerId) {
        Optional<Provider> provider = providerRepo.findById(providerId);
        if (provider.isPresent()) {
            Provider prov = provider.get();
            prov.setVerified(true);
            return providerRepo.save(prov);
        }
        return null;
    }
    
    public Provider unverifyProvider(Long providerId) {
        Optional<Provider> provider = providerRepo.findById(providerId);
        if (provider.isPresent()) {
            Provider prov = provider.get();
            prov.setVerified(false);
            return providerRepo.save(prov);
        }
        return null;
    }
}
