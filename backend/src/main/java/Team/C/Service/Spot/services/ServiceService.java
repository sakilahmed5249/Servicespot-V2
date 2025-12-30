package Team.C.Service.Spot.services;

import Team.C.Service.Spot.model.Service;
import Team.C.Service.Spot.repositery.ServiceRepo;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {
    
    private final ServiceRepo serviceRepo;
    
    public List<Service> getAllServices() {
        return serviceRepo.findAllActive();
    }
    
    public Optional<Service> getServiceById(Long id) {
        return serviceRepo.findById(id);
    }
    
    public List<Service> getServicesByProviderId(Long providerId) {
        return serviceRepo.findByProviderId(providerId);
    }
    
    public List<Service> getServicesByCategory(Long categoryId) {
        return serviceRepo.findByCategoryId(categoryId);
    }
    
    public List<Service> searchServices(String keyword, String city) {
        return serviceRepo.searchByNameAndLocation(keyword, city);
    }
    
    public List<Service> getServicesByLocation(String city, String state) {
        return serviceRepo.findByLocationOrderByRating(city, state);
    }
    
    public List<Service> getServicesByCity(String city) {
        return serviceRepo.findByCityIgnoreCase(city);
    }
    
    public List<Service> getServicesByLocationAndCategory(String city, String state, Long categoryId) {
        return serviceRepo.findByLocationAndCategory(city, state, categoryId);
    }
    
    public List<Service> getServicesByCategoryWithProviderStatus(Long categoryId, String city) {
        return serviceRepo.findByCategoryAndCityWithAllProviders(categoryId, city);
    }
    
    public List<Service> searchServicesByNameWithProviderStatus(String name, String city) {
        return serviceRepo.searchByNameAndCityWithAllProviders(name, city);
    }
    
    public Service createService(Service service) {
        return serviceRepo.save(service);
    }
    
    public Service updateService(Long id, Service updatedService) {
        return serviceRepo.findById(id)
                .map(service -> {
                    if (updatedService.getName() != null) {
                        service.setName(updatedService.getName());
                    }
                    if (updatedService.getDescription() != null) {
                        service.setDescription(updatedService.getDescription());
                    }
                    if (updatedService.getCategory() != null) {
                        service.setCategory(updatedService.getCategory());
                    }
                    if (updatedService.getPrice() != null) {
                        service.setPrice(updatedService.getPrice());
                    }
                    if (updatedService.getCity() != null) {
                        service.setCity(updatedService.getCity());
                    }
                    if (updatedService.getState() != null) {
                        service.setState(updatedService.getState());
                    }
                    if (updatedService.getPincode() != null) {
                        service.setPincode(updatedService.getPincode());
                    }
                    if (updatedService.getIsActive() != null) {
                        service.setIsActive(updatedService.getIsActive());
                    }
                    service.setUpdatedAt(new java.util.Date());
                    return serviceRepo.save(service);
                })
                .orElse(null);
    }
    
    public void updateServiceRating(Long serviceId, Double rating, Integer reviewCount) {
        serviceRepo.findById(serviceId)
                .ifPresent(service -> {
                    service.setRating(rating);
                    service.setReviewCount(reviewCount);
                    service.setUpdatedAt(new java.util.Date());
                    serviceRepo.save(service);
                });
    }
    
    public boolean deleteService(Long id) {
        if (serviceRepo.existsById(id)) {
            serviceRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
