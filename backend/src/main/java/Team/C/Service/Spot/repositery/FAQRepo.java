package Team.C.Service.Spot.repositery;

import Team.C.Service.Spot.model.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FAQRepo extends JpaRepository<FAQ, Long> {
    List<FAQ> findByIsActive(Boolean isActive);
    
    List<FAQ> findByCategoryAndIsActive(String category, Boolean isActive);
    
    List<FAQ> findByCategoryAndIsActiveOrderByDisplayOrder(String category, Boolean isActive);
}
