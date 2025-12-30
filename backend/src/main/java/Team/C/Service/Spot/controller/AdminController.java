package Team.C.Service.Spot.controller;

import Team.C.Service.Spot.model.Admin;
import Team.C.Service.Spot.model.Customer;
import Team.C.Service.Spot.model.Provider;
import Team.C.Service.Spot.services.AdminService;
import Team.C.Service.Spot.services.ServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {
    
    private final AdminService adminService;
    private final ServiceService serviceService;
    
    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        Admin admin = adminService.authenticateAdmin(email, password);
        if (admin != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("id", admin.getId());
            response.put("name", admin.getName());
            response.put("email", admin.getEmail());
            response.put("role", admin.getRole());
            return ResponseEntity.ok(response);
        }
        
        Map<String, String> error = new HashMap<>();
        error.put("error", "Invalid email or password");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable Long id) {
        return ResponseEntity.ok(new HashMap<>().put("message", "Admin details retrieved"));
    }
    
    @PostMapping("/init")
    public ResponseEntity<?> initializeAdmin() {
        Admin admin = adminService.createDefaultAdmin();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Default admin created/verified");
        response.put("email", admin.getEmail());
        response.put("password", admin.getPassword());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> customers = adminService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }
    
    @GetMapping("/providers")
    public ResponseEntity<List<Provider>> getAllProviders() {
        List<Provider> providers = adminService.getAllProviders();
        return ResponseEntity.ok(providers);
    }
    
    @GetMapping("/services")
    public ResponseEntity<List<?>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllServices());
    }
    
    @PostMapping("/customer/{customerId}/promote-admin")
    public ResponseEntity<?> promoteCustomerToAdmin(@PathVariable Long customerId) {
        Customer customer = adminService.promoteCustomerToAdmin(customerId);
        if (customer != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Customer promoted to admin");
            response.put("customer", customer);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/provider/{providerId}/promote-admin")
    public ResponseEntity<?> promoteProviderToAdmin(@PathVariable Long providerId) {
        Provider provider = adminService.promoteProviderToAdmin(providerId);
        if (provider != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Provider promoted to admin");
            response.put("provider", provider);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/customer/{customerId}/demote-admin")
    public ResponseEntity<?> demoteAdminToCustomer(@PathVariable Long customerId) {
        Customer customer = adminService.demoteAdminToCustomer(customerId);
        if (customer != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Admin demoted to customer");
            response.put("customer", customer);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/provider/{providerId}/demote-admin")
    public ResponseEntity<?> demoteAdminToProvider(@PathVariable Long providerId) {
        Provider provider = adminService.demoteAdminToProvider(providerId);
        if (provider != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Admin demoted to provider");
            response.put("provider", provider);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/customer/{customerId}/verify")
    public ResponseEntity<?> verifyCustomer(@PathVariable Long customerId) {
        Customer customer = adminService.verifyCustomer(customerId);
        if (customer != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Customer verified");
            response.put("customer", customer);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/customer/{customerId}/unverify")
    public ResponseEntity<?> unverifyCustomer(@PathVariable Long customerId) {
        Customer customer = adminService.unverifyCustomer(customerId);
        if (customer != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Customer unverified");
            response.put("customer", customer);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/provider/{providerId}/verify")
    public ResponseEntity<?> verifyProvider(@PathVariable Long providerId) {
        Provider provider = adminService.verifyProvider(providerId);
        if (provider != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Provider verified");
            response.put("provider", provider);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/provider/{providerId}/unverify")
    public ResponseEntity<?> unverifyProvider(@PathVariable Long providerId) {
        Provider provider = adminService.unverifyProvider(providerId);
        if (provider != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Provider unverified");
            response.put("provider", provider);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics() {
        try {
            List<Provider> allProviders = adminService.getAllProviders();
            long verifiedProviders = allProviders.stream()
                    .filter(p -> p.getVerified())
                    .count();
            
            List<Customer> allCustomers = adminService.getAllCustomers();
            long totalCustomers = allCustomers.size();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("tasksCompleted", 6450L);
            response.put("verifiedProfessionals", verifiedProviders > 0 ? verifiedProviders : 1200L);
            response.put("customerSatisfaction", 4.9);
            response.put("totalCustomers", totalCustomers);
            response.put("totalProviders", allProviders.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to retrieve statistics");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
