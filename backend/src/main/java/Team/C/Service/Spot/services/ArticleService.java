package Team.C.Service.Spot.services;

import Team.C.Service.Spot.model.Article;
import Team.C.Service.Spot.repositery.ArticleRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArticleService {
    
    private final ArticleRepo articleRepo;
    
    public List<Article> getAllArticles() {
        return articleRepo.findAll();
    }
    
    public List<Article> getPublishedArticles() {
        return articleRepo.findAllPublished();
    }
    
    public Optional<Article> getArticleById(Long id) {
        return articleRepo.findById(id);
    }
    
    public List<Article> getArticlesByCategory(String category) {
        return articleRepo.findByCategoryAndIsPublished(category, true);
    }
    
    public List<Article> searchArticles(String keyword) {
        return articleRepo.searchByKeyword(keyword);
    }
    
    public Article createArticle(Article article) {
        return articleRepo.save(article);
    }
    
    public Article updateArticle(Long id, Article updatedArticle) {
        return articleRepo.findById(id)
                .map(article -> {
                    article.setTitle(updatedArticle.getTitle());
                    article.setContent(updatedArticle.getContent());
                    article.setExcerpt(updatedArticle.getExcerpt());
                    article.setImage(updatedArticle.getImage());
                    article.setAuthor(updatedArticle.getAuthor());
                    article.setCategory(updatedArticle.getCategory());
                    article.setIsPublished(updatedArticle.getIsPublished());
                    if (updatedArticle.getIsPublished() && article.getPublishedAt() == null) {
                        article.setPublishedAt(new Date());
                    }
                    article.setUpdatedAt(new Date());
                    return articleRepo.save(article);
                })
                .orElse(null);
    }
    
    public Article publishArticle(Long id) {
        return articleRepo.findById(id)
                .map(article -> {
                    article.setIsPublished(true);
                    article.setPublishedAt(new Date());
                    article.setUpdatedAt(new Date());
                    return articleRepo.save(article);
                })
                .orElse(null);
    }
    
    public Article unpublishArticle(Long id) {
        return articleRepo.findById(id)
                .map(article -> {
                    article.setIsPublished(false);
                    article.setUpdatedAt(new Date());
                    return articleRepo.save(article);
                })
                .orElse(null);
    }
    
    public boolean deleteArticle(Long id) {
        if (articleRepo.existsById(id)) {
            articleRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
