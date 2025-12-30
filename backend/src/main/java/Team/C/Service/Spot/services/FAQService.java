package Team.C.Service.Spot.services;

import Team.C.Service.Spot.model.FAQ;
import Team.C.Service.Spot.repositery.FAQRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FAQService {
    
    private final FAQRepo faqRepo;
    
    public List<FAQ> getAllFAQs() {
        return faqRepo.findAll();
    }
    
    public List<FAQ> getActiveFAQs() {
        return faqRepo.findByIsActive(true);
    }
    
    public Optional<FAQ> getFAQById(Long id) {
        return faqRepo.findById(id);
    }
    
    public List<FAQ> getFAQsByCategory(String category) {
        return faqRepo.findByCategoryAndIsActiveOrderByDisplayOrder(category, true);
    }
    
    public FAQ createFAQ(FAQ faq) {
        return faqRepo.save(faq);
    }
    
    public FAQ updateFAQ(Long id, FAQ updatedFAQ) {
        return faqRepo.findById(id)
                .map(faq -> {
                    faq.setQuestion(updatedFAQ.getQuestion());
                    faq.setAnswer(updatedFAQ.getAnswer());
                    faq.setCategory(updatedFAQ.getCategory());
                    faq.setDisplayOrder(updatedFAQ.getDisplayOrder());
                    faq.setIsActive(updatedFAQ.getIsActive());
                    faq.setUpdatedAt(new java.util.Date());
                    return faqRepo.save(faq);
                })
                .orElse(null);
    }
    
    public FAQ activateFAQ(Long id) {
        return faqRepo.findById(id)
                .map(faq -> {
                    faq.setIsActive(true);
                    faq.setUpdatedAt(new java.util.Date());
                    return faqRepo.save(faq);
                })
                .orElse(null);
    }
    
    public FAQ deactivateFAQ(Long id) {
        return faqRepo.findById(id)
                .map(faq -> {
                    faq.setIsActive(false);
                    faq.setUpdatedAt(new java.util.Date());
                    return faqRepo.save(faq);
                })
                .orElse(null);
    }
    
    public boolean deleteFAQ(Long id) {
        if (faqRepo.existsById(id)) {
            faqRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
