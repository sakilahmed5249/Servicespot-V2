package Team.C.Service.Spot.repositery;

import Team.C.Service.Spot.model.Provider;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProviderRepo extends JpaRepository<Provider, Long> {
    Optional<Provider> findByEmail(String email);
    
    List<Provider> findByVerified(Boolean verified);
    
    List<Provider> findByCity(String city);
    
    List<Provider> findByServiceType(String serviceType);
    
    List<Provider> findByServiceTypeAndCity(String serviceType, String city);
    
    @Query("SELECT p FROM Provider p WHERE " +
           "(:service IS NULL OR LOWER(COALESCE(p.serviceType, '')) LIKE LOWER(CONCAT('%', :service, '%'))) AND " +
           "(:area IS NULL OR LOWER(COALESCE(p.addressLine, '')) LIKE LOWER(CONCAT('%', :area, '%'))) AND " +
           "(:city IS NULL OR LOWER(COALESCE(p.city, '')) LIKE LOWER(CONCAT('%', :city, '%')))")
    List<Provider> searchProviders(@Param("service") String service, 
                                   @Param("area") String area, 
                                   @Param("city") String city);
    
    @Query("SELECT DISTINCT p.city FROM Provider p WHERE p.city IS NOT NULL AND p.city != '' ORDER BY p.city ASC")
    List<String> findDistinctCities();
    
    @Query("SELECT DISTINCT p.serviceType FROM Provider p WHERE p.serviceType IS NOT NULL AND p.serviceType != '' ORDER BY p.serviceType ASC")
    List<String> findDistinctServiceTypes();
    
    @Query("SELECT DISTINCT p.addressLine FROM Provider p WHERE p.city = :city AND p.addressLine IS NOT NULL AND p.addressLine != '' ORDER BY p.addressLine ASC")
    List<String> findDistinctAreasByCity(@Param("city") String city);
    
    List<Provider> findByRole(String role);
}
