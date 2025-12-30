package Team.C.Service.Spot.services;

import Team.C.Service.Spot.model.Contact;
import Team.C.Service.Spot.repositery.ContactRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContactService {
    
    private final ContactRepo contactRepo;
    
    public List<Contact> getAllMessages() {
        return contactRepo.findAll();
    }
    
    public Optional<Contact> getMessageById(Long id) {
        return contactRepo.findById(id);
    }
    
    public List<Contact> getUnresolvedMessages() {
        return contactRepo.findByIsResolved(false);
    }
    
    public List<Contact> getResolvedMessages() {
        return contactRepo.findByIsResolved(true);
    }
    
    public List<Contact> getMessagesByEmail(String email) {
        return contactRepo.findByEmail(email);
    }
    
    public Contact createMessage(Contact contact) {
        return contactRepo.save(contact);
    }
    
    public Contact updateMessage(Long id, Contact updatedContact) {
        return contactRepo.findById(id)
                .map(contact -> {
                    contact.setName(updatedContact.getName());
                    contact.setEmail(updatedContact.getEmail());
                    contact.setSubject(updatedContact.getSubject());
                    contact.setMessage(updatedContact.getMessage());
                    contact.setPhone(updatedContact.getPhone());
                    contact.setUpdatedAt(new java.util.Date());
                    return contactRepo.save(contact);
                })
                .orElse(null);
    }
    
    public Contact resolveMessage(Long id) {
        return contactRepo.findById(id)
                .map(contact -> {
                    contact.setIsResolved(true);
                    contact.setUpdatedAt(new java.util.Date());
                    return contactRepo.save(contact);
                })
                .orElse(null);
    }
    
    public boolean deleteMessage(Long id) {
        if (contactRepo.existsById(id)) {
            contactRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
