package Team.C.Service.Spot.repositery;

import Team.C.Service.Spot.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepo extends JpaRepository<Contact, Long> {
    List<Contact> findByIsResolved(Boolean isResolved);
    
    List<Contact> findByEmail(String email);
}
