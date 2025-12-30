package Team.C.Service.Spot.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import Team.C.Service.Spot.dto.CustomerDTO;
import Team.C.Service.Spot.dto.NotificationRequest;
import Team.C.Service.Spot.model.Customer;
import Team.C.Service.Spot.services.CustomerService;
import Team.C.Service.Spot.services.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Slf4j
public class CustomerController {

    private final CustomerService customerService;
    private final NotificationService notificationService;

    private static final String ADMIN_EMAIL = "admin@servicespot.com";

    private CustomerDTO mapToDTO(Customer customer) {
        String profileImageBase64 = null;
        if (customer.getProfileImage() != null) {
            System.out.println("Converting image to base64. Customer ID: " + customer.getId() + ", Image bytes: "
                    + customer.getProfileImage().length);
            profileImageBase64 = "data:image/jpeg;base64,"
                    + java.util.Base64.getEncoder().encodeToString(customer.getProfileImage());
            System.out.println("Converted to base64. Length: " + profileImageBase64.length());
        } else {
            System.out.println("No image found for customer ID: " + customer.getId());
        }
        return CustomerDTO.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .doorNo(customer.getDoorNo())
                .addressLine(customer.getAddressLine())
                .city(customer.getCity())
                .state(customer.getState())
                .pincode(customer.getPincode() != null ? customer.getPincode().toString() : "0")
                .country(customer.getCountry())
                .latitude(customer.getLatitude())
                .longitude(customer.getLongitude())
                .verified(customer.getVerified())
                .profileImage(profileImageBase64)
                .build();
    }

    private Customer mapToEntity(CustomerDTO dto) {
        Integer pincode = 0;
        if (dto.getPincode() != null && !dto.getPincode().isEmpty()) {
            try {
                pincode = Integer.parseInt(dto.getPincode());
            } catch (NumberFormatException e) {
                pincode = 0;
            }
        }

        Double latitude = dto.getLatitude() != null ? dto.getLatitude() : 0.0;
        Double longitude = dto.getLongitude() != null ? dto.getLongitude() : 0.0;

        byte[] profileImageBytes = null;
        if (dto.getProfileImage() != null && !dto.getProfileImage().isEmpty()) {
            try {
                profileImageBytes = java.util.Base64.getDecoder().decode(dto.getProfileImage());
            } catch (IllegalArgumentException e) {
                profileImageBytes = null;
            }
        }

        return Customer.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .doorNo(dto.getDoorNo())
                .addressLine(dto.getAddressLine())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(pincode)
                .country(dto.getCountry())
                .latitude(latitude)
                .longitude(longitude)
                .verified(dto.getVerified() != null ? dto.getVerified() : false)
                .password(dto.getPassword())
                .role("CUSTOMER")
                .profileImage(profileImageBytes)
                .build();
    }

    @PostMapping(value = "/signup", consumes = { "application/json" }, produces = { "application/json" })
    public ResponseEntity<?> signup(@RequestBody CustomerDTO dto) {
        try {
            Customer customer = mapToEntity(dto);
            Customer saved = customerService.signup(customer);

            // Notify admin about new customer registration
            try {
                NotificationRequest request = NotificationRequest.builder()
                        .recipientEmail(ADMIN_EMAIL)
                        .recipientRole("ADMIN")
                        .title("New Customer Registered")
                        .message("New customer '" + saved.getName() + "' has registered.")
                        .type("NEW_CUSTOMER_REGISTERED")
                        .senderName(saved.getName())
                        .priority("NORMAL")
                        .actionUrl("/admin-customers")
                        .build();

                notificationService.createNotification(request);
                log.info("Admin notified about new customer: {}", saved.getEmail());
            } catch (Exception ex) {
                log.warn("Failed to notify admin about new customer: {}", ex.getMessage());
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(mapToDTO(saved));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping(value = "/login", consumes = { "application/json" }, produces = { "application/json" })
    public ResponseEntity<?> login(@RequestBody CustomerDTO dto) {
        var customer = customerService.getCustomerByEmail(dto.getEmail());
        if (customer.isPresent() && customer.get().getPassword().equals(dto.getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("customer", mapToDTO(customer.get()));
            return ResponseEntity.ok(response);
        }
        Map<String, String> error = new HashMap<>();
        error.put("success", "false");
        error.put("message", "Invalid credentials");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        List<CustomerDTO> dtos = customers.stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable Long id) {
        return customerService.getCustomerById(id)
                .map(customer -> ResponseEntity.ok(mapToDTO(customer)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getCustomerByEmail(@PathVariable String email) {
        return customerService.getCustomerByEmail(email)
                .map(customer -> ResponseEntity.ok(mapToDTO(customer)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/image-check")
    public ResponseEntity<?> checkImage(@PathVariable Long id) {
        return customerService.getCustomerById(id)
                .map(customer -> {
                    Map<String, Object> info = new HashMap<>();
                    info.put("customerId", customer.getId());
                    info.put("name", customer.getName());
                    info.put("hasImage", customer.getProfileImage() != null);
                    if (customer.getProfileImage() != null) {
                        info.put("imageSizeBytes", customer.getProfileImage().length);
                    }
                    System.out.println("Image check for customer " + id + ": " + info);
                    return ResponseEntity.ok(info);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @RequestBody CustomerDTO dto) {
        try {
            Customer customer = mapToEntity(dto);
            Customer updated = customerService.updateCustomer(id, customer);
            if (updated != null) {
                return ResponseEntity.ok(mapToDTO(updated));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getClass().getSimpleName());
            error.put("message", e.getMessage());
            error.put("details", e.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/{id}/update-password")
    public ResponseEntity<?> updatePassword(@PathVariable Long id, @RequestBody CustomerDTO dto) {
        Customer updated = customerService.updatePassword(id, dto.getPassword());
        if (updated != null) {
            return ResponseEntity.ok(mapToDTO(updated));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok("Customer deleted successfully");
    }

    @PostMapping("/{id}/upload-image")
    public ResponseEntity<?> uploadProfileImage(@PathVariable Long id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            System.out.println("Upload image request for customer: " + id);
            System.out.println(
                    "Received file: " + (file != null && !file.isEmpty() ? "Yes, size: " + file.getSize() : "No"));

            if (file == null || file.isEmpty()) {
                System.out.println("No file provided");
                return ResponseEntity.badRequest().body("No file provided");
            }

            byte[] imageBytes = file.getBytes();
            System.out.println("Image bytes received: " + imageBytes.length);

            Customer customer = customerService.getCustomerById(id)
                    .orElseThrow(() -> new Exception("Customer not found"));

            System.out.println("Before update - Customer has image: " + (customer.getProfileImage() != null));
            customer.setProfileImage(imageBytes);
            System.out.println("After setting - Customer has image: "
                    + (customer.getProfileImage() != null ? "Yes, " + customer.getProfileImage().length + " bytes"
                            : "No"));

            Customer updated = customerService.updateCustomer(id, customer);
            System.out.println("After save - Updated customer has image: "
                    + (updated.getProfileImage() != null ? "Yes, " + updated.getProfileImage().length + " bytes"
                            : "No"));

            return ResponseEntity.ok(mapToDTO(updated));
        } catch (Exception e) {
            System.out.println("Upload error: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getClass().getSimpleName());
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
