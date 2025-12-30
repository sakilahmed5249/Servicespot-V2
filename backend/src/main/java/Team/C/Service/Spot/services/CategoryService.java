package Team.C.Service.Spot.services;

import Team.C.Service.Spot.model.Category;
import Team.C.Service.Spot.repositery.CategoryRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {
    
    private final CategoryRepo categoryRepo;
    
    public List<Category> getAllCategories() {
        return categoryRepo.findAll();
    }
    
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepo.findById(id);
    }
    
    public Optional<Category> getCategoryByName(String name) {
        return categoryRepo.findByName(name);
    }
    
    public Category createCategory(Category category) {
        return categoryRepo.save(category);
    }
    
    public Category updateCategory(Long id, Category updatedCategory) {
        return categoryRepo.findById(id)
                .map(category -> {
                    category.setName(updatedCategory.getName());
                    category.setDescription(updatedCategory.getDescription());
                    category.setIcon(updatedCategory.getIcon());
                    return categoryRepo.save(category);
                })
                .orElse(null);
    }
    
    public boolean deleteCategory(Long id) {
        if (categoryRepo.existsById(id)) {
            categoryRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
