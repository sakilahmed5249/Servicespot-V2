package Team.C.Service.Spot.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import Team.C.Service.Spot.model.Provider;
import Team.C.Service.Spot.repositery.ProviderRepo;
import Team.C.Service.Spot.repositery.ServiceRepo;

@Service
@RequiredArgsConstructor
public class ProviderService {

    private final ProviderRepo providerRepo;
    private final ServiceRepo serviceRepo;

    public Provider signup(Provider provider) {
        return providerRepo.save(provider);
    }

    public Optional<Provider> login(String email, String password) {
        return providerRepo.findByEmail(email)
                .filter(p -> p.getPassword().equals(password));
    }

    public Optional<Provider> getProviderById(Long id) {
        return providerRepo.findById(id);
    }

    public Optional<Provider> getProviderByEmail(String email) {
        return providerRepo.findByEmail(email);
    }

    public List<Provider> getAllProviders() {
        return providerRepo.findAll();
    }

    public List<Provider> getVerifiedProviders() {
        return providerRepo.findByVerified(true);
    }

    public List<Provider> getUnverifiedProviders() {
        return providerRepo.findByVerified(false);
    }

    public Provider updateProvider(Long id, Provider updatedProvider) {
        return providerRepo.findById(id)
                .map(provider -> {
                    if (updatedProvider.getName() != null) {
                        provider.setName(updatedProvider.getName());
                    }
                    if (updatedProvider.getEmail() != null) {
                        provider.setEmail(updatedProvider.getEmail());
                    }
                    if (updatedProvider.getPassword() != null) {
                        provider.setPassword(updatedProvider.getPassword());
                    }
                    if (updatedProvider.getPhone() != null) {
                        provider.setPhone(updatedProvider.getPhone());
                    }
                    if (updatedProvider.getDoorNo() != null) {
                        provider.setDoorNo(updatedProvider.getDoorNo());
                    }
                    if (updatedProvider.getAddressLine() != null) {
                        provider.setAddressLine(updatedProvider.getAddressLine());
                    }
                    if (updatedProvider.getCity() != null) {
                        provider.setCity(updatedProvider.getCity());
                    }
                    if (updatedProvider.getState() != null) {
                        provider.setState(updatedProvider.getState());
                    }
                    if (updatedProvider.getPincode() != null) {
                        provider.setPincode(updatedProvider.getPincode());
                    }
                    if (updatedProvider.getCountry() != null) {
                        provider.setCountry(updatedProvider.getCountry());
                    }
                    if (updatedProvider.getServiceType() != null) {
                        provider.setServiceType(updatedProvider.getServiceType());
                    }
                    if (updatedProvider.getPrice() != null) {
                        provider.setPrice(updatedProvider.getPrice());
                    }
                    if (updatedProvider.getLatitude() != null) {
                        provider.setLatitude(updatedProvider.getLatitude());
                    }
                    if (updatedProvider.getLongitude() != null) {
                        provider.setLongitude(updatedProvider.getLongitude());
                    }
                    if (updatedProvider.getProfileImage() != null) {
                        provider.setProfileImage(updatedProvider.getProfileImage());
                    }
                    return providerRepo.save(provider);
                })
                .orElse(null);
    }

    public Provider verifyProvider(Long id) {
        return providerRepo.findById(id)
                .map(provider -> {
                    provider.setVerified(true);
                    return providerRepo.save(provider);
                })
                .orElse(null);
    }

    public Provider rejectProvider(Long id) {
        return providerRepo.findById(id)
                .map(provider -> {
                    provider.setVerified(false);
                    return providerRepo.save(provider);
                })
                .orElse(null);
    }

    public void deleteProvider(Long id) {
        providerRepo.deleteById(id);
    }

    public List<Provider> searchProviders(String service, String area, String city) {
        return providerRepo.searchProviders(service, area, city);
    }

    public List<Provider> findByCity(String city) {
        return providerRepo.findByCity(city);
    }

    public List<Provider> findByServiceType(String serviceType) {
        return providerRepo.findByServiceType(serviceType);
    }

    public List<Provider> findByServiceTypeAndCity(String serviceType, String city) {
        return providerRepo.findByServiceTypeAndCity(serviceType, city);
    }

    public List<String> getDistinctCities() {
        return providerRepo.findDistinctCities();
    }

    public List<String> getDistinctServiceTypes() {
        return providerRepo.findDistinctServiceTypes();
    }

    public List<String> getDistinctAreasByCity(String city) {
        return providerRepo.findDistinctAreasByCity(city);
    }

    public List<Provider> getNearbyVerifiedProviders(Double userLat, Double userLon, Double radiusKm) {
        List<Provider> verifiedProviders = getVerifiedProviders();
        return verifiedProviders.stream()
                .filter(p -> p.getLatitude() != null && p.getLongitude() != null)
                .filter(p -> calculateDistance(userLat, userLon, p.getLatitude(), p.getLongitude()) <= radiusKm)
                .toList();
    }

    public List<Provider> getNearbyProviders(Double userLat, Double userLon, Double radiusKm) {
        List<Provider> allProviders = getAllProviders();
        return allProviders.stream()
                .filter(p -> p.getLatitude() != null && p.getLongitude() != null)
                .filter(p -> calculateDistance(userLat, userLon, p.getLatitude(), p.getLongitude()) <= radiusKm)
                .toList();
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

    public Long getActiveServiceCount(Long providerId) {
        return serviceRepo.countActiveServicesByProviderId(providerId);
    }
}
