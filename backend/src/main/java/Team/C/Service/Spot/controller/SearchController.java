package Team.C.Service.Spot.controller;

import Team.C.Service.Spot.dto.ProviderDTO;
import Team.C.Service.Spot.model.Provider;
import Team.C.Service.Spot.services.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Base64;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SearchController {

    private final ProviderService providerService;

    private ProviderDTO mapToDTO(Provider provider) {
        String profileImageBase64 = null;
        if (provider.getProfileImage() != null) {
            profileImageBase64 = "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(provider.getProfileImage());
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

    @GetMapping("/search")
    public ResponseEntity<List<ProviderDTO>> searchProviders(
            @RequestParam(required = false) String service,
            @RequestParam(required = false) String area,
            @RequestParam(required = false) String city) {
        
        service = (service != null && !service.trim().isEmpty()) ? service.trim() : null;
        area = (area != null && !area.trim().isEmpty()) ? area.trim() : null;
        city = (city != null && !city.trim().isEmpty()) ? city.trim() : null;
        
        List<Provider> results = providerService.searchProviders(service, area, city);
        List<ProviderDTO> dtos = results.stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/search/city")
    public ResponseEntity<List<ProviderDTO>> searchByCity(@RequestParam String city) {
        List<Provider> results = providerService.findByCity(city);
        List<ProviderDTO> dtos = results.stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/search/service")
    public ResponseEntity<List<ProviderDTO>> searchByService(@RequestParam String serviceType) {
        List<Provider> results = providerService.findByServiceType(serviceType);
        List<ProviderDTO> dtos = results.stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/search/service-city")
    public ResponseEntity<List<ProviderDTO>> searchByServiceAndCity(
            @RequestParam String serviceType,
            @RequestParam String city) {
        List<Provider> results = providerService.findByServiceTypeAndCity(serviceType, city);
        List<ProviderDTO> dtos = results.stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/dropdown/cities")
    public ResponseEntity<List<String>> getCities() {
        return ResponseEntity.ok(providerService.getDistinctCities());
    }

    @GetMapping("/dropdown/services")
    public ResponseEntity<List<String>> getServices() {
        return ResponseEntity.ok(providerService.getDistinctServiceTypes());
    }

    @GetMapping("/dropdown/areas")
    public ResponseEntity<List<String>> getAreasByCity(@RequestParam String city) {
        return ResponseEntity.ok(providerService.getDistinctAreasByCity(city));
    }
}
