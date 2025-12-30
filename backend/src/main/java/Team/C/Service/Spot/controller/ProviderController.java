package Team.C.Service.Spot.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Team.C.Service.Spot.dto.NotificationRequest;
import Team.C.Service.Spot.dto.ProviderDTO;
import Team.C.Service.Spot.model.Provider;
import Team.C.Service.Spot.services.NotificationService;
import Team.C.Service.Spot.services.ProviderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/provider")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Slf4j
public class ProviderController {

    private final ProviderService providerService;
    private final NotificationService notificationService;

    private static final String ADMIN_EMAIL = "admin@servicespot.com";

    private ProviderDTO mapToDTO(Provider provider) {
        String profileImageBase64 = null;
        if (provider.getProfileImage() != null) {
            System.out.println("Converting image to base64. Provider ID: " + provider.getId() + ", Image bytes: "
                    + provider.getProfileImage().length);
            profileImageBase64 = "data:image/jpeg;base64,"
                    + java.util.Base64.getEncoder().encodeToString(provider.getProfileImage());
            System.out.println("Converted to base64. Length: " + profileImageBase64.length());
        } else {
            System.out.println("No image found for provider ID: " + provider.getId());
        }
        return ProviderDTO.builder()
                .id(provider.getId())
                .name(provider.getName())
                .email(provider.getEmail())
                .phone(provider.getPhone())
                .doorNo(provider.getDoorNo())
                .addressLine(provider.getAddressLine())
                .city(provider.getCity())
                .state(provider.getState())
                .pincode(provider.getPincode())
                .country(provider.getCountry())
                .serviceType(provider.getServiceType())
                .price(provider.getPrice())
                .latitude(provider.getLatitude())
                .longitude(provider.getLongitude())
                .verified(provider.getVerified())
                .profileImage(profileImageBase64)
                .build();
    }

    private ProviderDTO mapToDTOWithServiceCount(Provider provider) {
        ProviderDTO dto = mapToDTO(provider);
        Long activeServiceCount = providerService.getActiveServiceCount(provider.getId());
        dto.setActiveServiceCount(activeServiceCount);
        return dto;
    }

    private Provider mapToEntity(ProviderDTO dto) {
        Double latitude = dto.getLatitude() != null ? dto.getLatitude() : null;
        Double longitude = dto.getLongitude() != null ? dto.getLongitude() : null;
        byte[] profileImageBytes = null;
        if (dto.getProfileImage() != null && !dto.getProfileImage().isEmpty()) {
            try {
                profileImageBytes = java.util.Base64.getDecoder().decode(dto.getProfileImage());
            } catch (IllegalArgumentException e) {
                profileImageBytes = null;
            }
        }
        return Provider.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .phone(dto.getPhone())
                .doorNo(dto.getDoorNo())
                .addressLine(dto.getAddressLine())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(dto.getPincode())
                .country(dto.getCountry())
                .serviceType(dto.getServiceType())
                .price(dto.getPrice() != null ? dto.getPrice() : 0.0f)
                .latitude(latitude)
                .longitude(longitude)
                .verified(dto.getVerified() != null ? dto.getVerified() : false)
                .role("PROVIDER")
                .profileImage(profileImageBytes)
                .build();
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody ProviderDTO dto) {
        try {
            if (dto.getName() == null || dto.getName().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required");
            }
            if (dto.getEmail() == null || dto.getEmail().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (dto.getPassword() == null || dto.getPassword().isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }
            if (dto.getPhone() == null || dto.getPhone().isEmpty()) {
                return ResponseEntity.badRequest().body("Phone is required");
            }
            if (dto.getDoorNo() == null || dto.getDoorNo().isEmpty()) {
                return ResponseEntity.badRequest().body("Door number is required");
            }
            if (dto.getAddressLine() == null || dto.getAddressLine().isEmpty()) {
                return ResponseEntity.badRequest().body("Address is required");
            }
            if (dto.getCity() == null || dto.getCity().isEmpty()) {
                return ResponseEntity.badRequest().body("City is required");
            }
            if (dto.getState() == null || dto.getState().isEmpty()) {
                return ResponseEntity.badRequest().body("State is required");
            }
            if (dto.getPincode() == null) {
                return ResponseEntity.badRequest().body("Pincode is required");
            }
            if (dto.getServiceType() == null || dto.getServiceType().isEmpty()) {
                return ResponseEntity.badRequest().body("Service type is required");
            }

            Provider provider = mapToEntity(dto);
            Provider savedProvider = providerService.signup(provider);

            // Notify admin about new provider registration
            try {
                NotificationRequest request = NotificationRequest.builder()
                        .recipientEmail(ADMIN_EMAIL)
                        .recipientRole("ADMIN")
                        .title("New Provider Registered")
                        .message("New provider '" + savedProvider.getName() + "' has registered. Service: "
                                + savedProvider.getServiceType())
                        .type("NEW_PROVIDER_REGISTERED")
                        .senderName(savedProvider.getName())
                        .priority("HIGH")
                        .actionUrl("/admin-providers")
                        .build();

                notificationService.createNotification(request);
                log.info("Admin notified about new provider: {}", savedProvider.getEmail());
            } catch (Exception ex) {
                log.warn("Failed to notify admin about new provider: {}", ex.getMessage());
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(mapToDTO(savedProvider));
        } catch (Exception e) {
            java.util.Map<String, Object> error = new java.util.HashMap<>();
            error.put("error", e.getClass().getSimpleName());
            error.put("message", e.getMessage());
            error.put("details", e.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody ProviderDTO dto) {
        var result = providerService.login(dto.getEmail(), dto.getPassword());
        if (result.isPresent()) {
            return ResponseEntity.ok(mapToDTO(result.get()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProviderById(@PathVariable Long id) {
        return providerService.getProviderById(id)
                .map(provider -> ResponseEntity.ok(mapToDTO(provider)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getProviderByEmail(@PathVariable String email) {
        return providerService.getProviderByEmail(email)
                .map(provider -> ResponseEntity.ok(mapToDTO(provider)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/image-check")
    public ResponseEntity<?> checkImage(@PathVariable Long id) {
        return providerService.getProviderById(id)
                .map(provider -> {
                    java.util.Map<String, Object> info = new java.util.HashMap<>();
                    info.put("providerId", provider.getId());
                    info.put("name", provider.getName());
                    info.put("hasImage", provider.getProfileImage() != null);
                    if (provider.getProfileImage() != null) {
                        info.put("imageSizeBytes", provider.getProfileImage().length);
                    }
                    System.out.println("Image check for provider " + id + ": " + info);
                    return ResponseEntity.ok(info);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<ProviderDTO>> getAllProviders() {
        List<Provider> providers = providerService.getAllProviders();
        List<ProviderDTO> dtos = providers.stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/verified/all")
    public ResponseEntity<List<ProviderDTO>> getVerifiedProviders() {
        List<Provider> providers = providerService.getVerifiedProviders();
        List<ProviderDTO> dtos = providers.stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<ProviderDTO>> getNearbyProviders(
            @RequestParam(name = "lat") Double latitude,
            @RequestParam(name = "lon") Double longitude,
            @RequestParam(name = "radius", defaultValue = "20") Double radiusKm) {
        try {
            List<Provider> providers = providerService.getNearbyProviders(latitude, longitude, radiusKm);

            List<ProviderDTO> dtos = providers.stream().map(provider -> {
                ProviderDTO dto = mapToDTOWithServiceCount(provider);
                double distance = calculateDistance(latitude, longitude, provider.getLatitude(),
                        provider.getLongitude());
                dto.setDistance(distance);
                return dto;
            }).sorted((p1, p2) -> Double.compare(p1.getDistance(), p2.getDistance()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new java.util.ArrayList<>());
        }
    }

    private double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    @GetMapping("/unverified/all")
    public ResponseEntity<List<ProviderDTO>> getUnverifiedProviders() {
        List<Provider> providers = providerService.getUnverifiedProviders();
        List<ProviderDTO> dtos = providers.stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProvider(@PathVariable Long id, @RequestBody ProviderDTO dto) {
        try {
            Provider provider = mapToEntity(dto);
            Provider updated = providerService.updateProvider(id, provider);
            if (updated != null) {
                return ResponseEntity.ok(mapToDTO(updated));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            java.util.Map<String, Object> error = new java.util.HashMap<>();
            error.put("error", e.getClass().getSimpleName());
            error.put("message", e.getMessage());
            error.put("details", e.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<?> verifyProvider(@PathVariable Long id) {
        Provider verified = providerService.verifyProvider(id);
        if (verified != null) {
            return ResponseEntity.ok(mapToDTO(verified));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectProvider(@PathVariable Long id) {
        Provider rejected = providerService.rejectProvider(id);
        if (rejected != null) {
            return ResponseEntity.ok(mapToDTO(rejected));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProvider(@PathVariable Long id) {
        providerService.deleteProvider(id);
        return ResponseEntity.ok("Provider deleted successfully");
    }

    @PostMapping("/{id}/upload-image")
    public ResponseEntity<?> uploadProfileImage(@PathVariable Long id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            System.out.println("Upload image request for provider: " + id);
            System.out.println(
                    "Received file: " + (file != null && !file.isEmpty() ? "Yes, size: " + file.getSize() : "No"));

            if (file == null || file.isEmpty()) {
                System.out.println("No file provided");
                return ResponseEntity.badRequest().body("No file provided");
            }

            byte[] imageBytes = file.getBytes();
            System.out.println("Image bytes received: " + imageBytes.length);

            Provider provider = providerService.getProviderById(id)
                    .orElseThrow(() -> new Exception("Provider not found"));

            System.out.println("Before update - Provider has image: " + (provider.getProfileImage() != null));
            provider.setProfileImage(imageBytes);
            System.out.println("After setting - Provider has image: "
                    + (provider.getProfileImage() != null ? "Yes, " + provider.getProfileImage().length + " bytes"
                            : "No"));

            Provider updated = providerService.updateProvider(id, provider);
            System.out.println("After save - Updated provider has image: "
                    + (updated.getProfileImage() != null ? "Yes, " + updated.getProfileImage().length + " bytes"
                            : "No"));

            return ResponseEntity.ok(mapToDTO(updated));
        } catch (Exception e) {
            System.out.println("Upload error: " + e.getMessage());
            e.printStackTrace();
            java.util.Map<String, Object> error = new java.util.HashMap<>();
            error.put("error", e.getClass().getSimpleName());
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
