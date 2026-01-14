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
                                            .build());
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
                                            .build());
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
                                            .build());
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
                                            .build());
                        });
                if (!log.toString().contains("Created Home Cleaning")) {
                    log.append("Home Cleaning category already exists. ");
                }
                categoriesCount++;

                // Note: Fake demo providers and services have been removed
                // Real providers and services should be created through the proper signup flow
                log.append("Categories initialized. No demo providers/services created. ");

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
