package Team.C.Service.Spot.controller;

import Team.C.Service.Spot.model.Category;
import Team.C.Service.Spot.model.Provider;
import Team.C.Service.Spot.model.Service;
import Team.C.Service.Spot.services.CategoryService;
import Team.C.Service.Spot.services.ProviderService;
import Team.C.Service.Spot.services.ServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/init")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DataInitController {
    
    private final CategoryService categoryService;
    private final ProviderService providerService;
    private final ServiceService serviceService;
    
    @GetMapping("/services-count")
    public ResponseEntity<?> getServicesCount() {
        List<?> allServices = serviceService.getAllServices();
        Map<String, Object> response = new HashMap<>();
        response.put("total_services", allServices.size());
        response.put("services", allServices);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/demo-data")
    public ResponseEntity<?> initializeDemoData() {
        try {
            System.out.println("Starting demo data initialization...");
            
            int categoriesCount = 0;
            int providersCount = 0;
            int servicesCount = 0;
            StringBuilder log = new StringBuilder();
            
            try {
                Category electrician = categoryService.getCategoryByName("Electrician")
                        .orElseGet(() -> {
                            log.append("Created Electrician category. ");
                            return categoryService.createCategory(
                                    Category.builder()
                                            .name("Electrician")
                                            .description("Electrical services")
                                            .build()
                            );
                        });
                if (!log.toString().contains("Created Electrician")) {
                    log.append("Electrician category already exists. ");
                }
                categoriesCount++;
                
                Category plumber = categoryService.getCategoryByName("Plumber")
                        .orElseGet(() -> {
                            log.append("Created Plumber category. ");
                            return categoryService.createCategory(
                                    Category.builder()
                                            .name("Plumber")
                                            .description("Plumbing services")
                                            .build()
                            );
                        });
                if (!log.toString().contains("Created Plumber")) {
                    log.append("Plumber category already exists. ");
                }
                categoriesCount++;
                
                Category painter = categoryService.getCategoryByName("Painter")
                        .orElseGet(() -> {
                            log.append("Created Painter category. ");
                            return categoryService.createCategory(
                                    Category.builder()
                                            .name("Painter")
                                            .description("Painting services")
                                            .build()
                            );
                        });
                if (!log.toString().contains("Created Painter")) {
                    log.append("Painter category already exists. ");
                }
                categoriesCount++;
                
                Category cleaner = categoryService.getCategoryByName("Home Cleaning")
                        .orElseGet(() -> {
                            log.append("Created Home Cleaning category. ");
                            return categoryService.createCategory(
                                    Category.builder()
                                            .name("Home Cleaning")
                                            .description("Home cleaning services")
                                            .build()
                            );
                        });
                if (!log.toString().contains("Created Home Cleaning")) {
                    log.append("Home Cleaning category already exists. ");
                }
                categoriesCount++;
                
                Provider provider1 = providerService.getProviderByEmail("raj@example.com")
                        .orElseGet(() -> {
                            log.append("Created Raj Kumar provider. ");
                            return providerService.signup(Provider.builder()
                                    .name("Raj Kumar")
                                    .email("raj@example.com")
                                    .password("password123")
                                    .phone("9999999991")
                                    .doorNo("123")
                                    .addressLine("Main Street")
                                    .city("Hyderabad")
                                    .state("Telangana")
                                    .pincode(500001)
                                    .country("India")
                                    .serviceType("Electrician")
                                    .price(500.0f)
                                    .verified(true)
                                    .role("PROVIDER")
                                    .build());
                        });
                if (!log.toString().contains("Created Raj Kumar")) {
                    log.append("Raj Kumar provider already exists. ");
                }
                
                Provider provider2 = providerService.getProviderByEmail("arjun@example.com")
                        .orElseGet(() -> {
                            log.append("Created Arjun Singh provider. ");
                            return providerService.signup(Provider.builder()
                                    .name("Arjun Singh")
                                    .email("arjun@example.com")
                                    .password("password123")
                                    .phone("9999999992")
                                    .doorNo("456")
                                    .addressLine("Second Lane")
                                    .city("Hyderabad")
                                    .state("Telangana")
                                    .pincode(500002)
                                    .country("India")
                                    .serviceType("Plumber")
                                    .price(400.0f)
                                    .verified(true)
                                    .role("PROVIDER")
                                    .build());
                        });
                if (!log.toString().contains("Created Arjun Singh")) {
                    log.append("Arjun Singh provider already exists. ");
                }
                
                Provider provider3 = providerService.getProviderByEmail("vikram@example.com")
                        .orElseGet(() -> {
                            log.append("Created Vikram Patel provider. ");
                            return providerService.signup(Provider.builder()
                                    .name("Vikram Patel")
                                    .email("vikram@example.com")
                                    .password("password123")
                                    .phone("9999999993")
                                    .doorNo("789")
                                    .addressLine("Third Road")
                                    .city("Mumbai")
                                    .state("Maharashtra")
                                    .pincode(400001)
                                    .country("India")
                                    .serviceType("Painter")
                                    .price(300.0f)
                                    .verified(true)
                                    .role("PROVIDER")
                                    .build());
                        });
                if (!log.toString().contains("Created Vikram Patel")) {
                    log.append("Vikram Patel provider already exists. ");
                }
                providersCount = 3;
                log.append("Processed 3 providers. ");
                
                Service[] services = new Service[]{
                    Service.builder()
                            .name("Electrical Wiring Installation")
                            .description("Professional electrical wiring installation for homes and offices")
                            .category(electrician)
                            .provider(provider1)
                            .price(500.0f)
                            .city("Hyderabad")
                            .state("Telangana")
                            .pincode(500001)
                            .rating(4.5)
                            .reviewCount(25)
                            .isActive(true)
                            .build(),
                    Service.builder()
                            .name("Pipe Leakage Repair")
                            .description("Fix all types of pipe leakage issues quickly and efficiently")
                            .category(plumber)
                            .provider(provider2)
                            .price(400.0f)
                            .city("Hyderabad")
                            .state("Telangana")
                            .pincode(500002)
                            .rating(4.8)
                            .reviewCount(32)
                            .isActive(true)
                            .build(),
                    Service.builder()
                            .name("House Painting")
                            .description("Complete house painting with premium quality paints")
                            .category(painter)
                            .provider(provider3)
                            .price(300.0f)
                            .city("Mumbai")
                            .state("Maharashtra")
                            .pincode(400001)
                            .rating(4.6)
                            .reviewCount(18)
                            .isActive(true)
                            .build(),
                    Service.builder()
                            .name("Circuit Breaker Replacement")
                            .description("Safe and reliable circuit breaker replacement service")
                            .category(electrician)
                            .provider(provider1)
                            .price(600.0f)
                            .city("Hyderabad")
                            .state("Telangana")
                            .pincode(500001)
                            .rating(4.9)
                            .reviewCount(42)
                            .isActive(true)
                            .build(),
                    Service.builder()
                            .name("Bathroom Renovation")
                            .description("Complete bathroom renovation with modern fixtures")
                            .category(plumber)
                            .provider(provider2)
                            .price(5000.0f)
                            .city("Hyderabad")
                            .state("Telangana")
                            .pincode(500002)
                            .rating(4.7)
                            .reviewCount(15)
                            .isActive(true)
                            .build(),
                    Service.builder()
                            .name("Home Cleaning Service")
                            .description("Professional deep cleaning for your home")
                            .category(cleaner)
                            .provider(provider3)
                            .price(800.0f)
                            .city("Mumbai")
                            .state("Maharashtra")
                            .pincode(400001)
                            .rating(4.4)
                            .reviewCount(28)
                            .isActive(true)
                            .build()
                };
                
                for (Service service : services) {
                    serviceService.createService(service);
                    servicesCount++;
                }
                log.append("Created ").append(servicesCount).append(" services. ");
                
            } catch (Exception e) {
                log.append("Error during data creation: ").append(e.getMessage()).append(" ");
                System.err.println(log.toString());
                e.printStackTrace();
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Demo data initialization completed");
            response.put("services_created", servicesCount);
            response.put("providers_created", providersCount);
            response.put("categories_created", categoriesCount);
            response.put("log", log.toString());
            response.put("total_services_in_db", serviceService.getAllServices().size());
            
            System.out.println("Demo data initialization complete: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(error);
        }
    }
}
