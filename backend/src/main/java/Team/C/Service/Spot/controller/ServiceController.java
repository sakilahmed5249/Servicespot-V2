package Team.C.Service.Spot.controller;

import Team.C.Service.Spot.model.Service;
import Team.C.Service.Spot.services.ServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Base64;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceController {
    
    private final ServiceService serviceService;
    
    private Object convertToDTO(Service service) {
        if (service == null) {
            return null;
        }
        
        return new java.util.HashMap<String, Object>() {{
            put("id", service.getId());
            put("name", service.getName());
            put("description", service.getDescription());
            put("price", service.getPrice());
            put("city", service.getCity());
            put("state", service.getState());
            put("pincode", service.getPincode());
            put("rating", service.getRating());
            put("reviewCount", service.getReviewCount());
            put("isActive", service.getIsActive());
            put("createdAt", service.getCreatedAt());
            put("updatedAt", service.getUpdatedAt());
            put("category", service.getCategory() != null ? 
                new java.util.HashMap<String, Object>() {{
                    put("id", service.getCategory().getId());
                    put("name", service.getCategory().getName());
                    put("description", service.getCategory().getDescription());
                }} : null);
            put("provider", service.getProvider() != null ? 
                new java.util.HashMap<String, Object>() {{
                    put("id", service.getProvider().getId());
                    put("name", service.getProvider().getName());
                    put("email", service.getProvider().getEmail());
                    put("phone", service.getProvider().getPhone());
                    put("city", service.getProvider().getCity());
                    put("state", service.getProvider().getState());
                    put("pincode", service.getProvider().getPincode());
                    put("addressLine", service.getProvider().getAddressLine());
                    put("serviceType", service.getProvider().getServiceType());
                    put("price", service.getProvider().getPrice());
                    put("verified", service.getProvider().getVerified());
                    put("profileImage", service.getProvider().getProfileImage() != null ? 
                        "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(service.getProvider().getProfileImage())
                        : null);
                }} : null);
        }};
    }
    
    @GetMapping
    public ResponseEntity<List<?>> getAllServices() {
        List<?> services = serviceService.getAllServices()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(services);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getServiceById(@PathVariable Long id) {
        return serviceService.getServiceById(id)
                .map(service -> ResponseEntity.ok(convertToDTO(service)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<?>> getServicesByProvider(@PathVariable Long providerId) {
        List<?> services = serviceService.getServicesByProviderId(providerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(services);
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<?>> getServicesByCategory(@PathVariable Long categoryId) {
        List<?> services = serviceService.getServicesByCategory(categoryId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(services);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<?>> searchServices(@RequestParam String keyword, @RequestParam String city) {
        List<?> services = serviceService.searchServices(keyword, city)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(services);
    }
    
    @GetMapping("/location/{city}/{state}")
    public ResponseEntity<List<?>> getServicesByLocation(@PathVariable String city, @PathVariable String state) {
        List<?> services = serviceService.getServicesByLocation(city, state)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(services);
    }
    
    @GetMapping("/location/{city}/all")
    public ResponseEntity<List<?>> getServicesByCity(@PathVariable String city) {
        List<?> services = serviceService.getServicesByCity(city)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(services);
    }
    
    @GetMapping("/by-category")
    public ResponseEntity<List<?>> getServicesByCategory(@RequestParam Long categoryId, @RequestParam String city) {
        List<?> services = serviceService.getServicesByCategoryWithProviderStatus(categoryId, city)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(services);
    }
    
    @GetMapping("/search-by-name")
    public ResponseEntity<List<?>> searchServicesByName(@RequestParam String name, @RequestParam String city) {
        List<?> services = serviceService.searchServicesByNameWithProviderStatus(name, city)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(services);
    }
    
    @GetMapping("/location/{city}/{state}/category/{categoryId}")
    public ResponseEntity<List<?>> getServicesByLocationAndCategory(
            @PathVariable String city,
            @PathVariable String state,
            @PathVariable Long categoryId) {
        List<?> services = serviceService.getServicesByLocationAndCategory(city, state, categoryId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(services);
    }
    
    @PostMapping
    public ResponseEntity<?> createService(@RequestBody Service service) {
        Service created = serviceService.createService(service);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(created));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateService(@PathVariable Long id, @RequestBody Service service) {
        try {
            Service updated = serviceService.updateService(id, service);
            if (updated != null) {
                return ResponseEntity.ok(convertToDTO(updated));
            }
            return ResponseEntity.status(404).body("Service not found");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error updating service: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        try {
            if (serviceService.deleteService(id)) {
                return ResponseEntity.ok("Service deleted successfully");
            }
            return ResponseEntity.status(404).body("Service not found");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error deleting service: " + e.getMessage());
        }
    }
}
