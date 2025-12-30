package Team.C.Service.Spot.repositery;

import Team.C.Service.Spot.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepo extends JpaRepository<Article, Long> {
    
    @Query("SELECT a FROM Article a WHERE a.isPublished = true ORDER BY a.publishedAt DESC")
    List<Article> findAllPublished();
    
    List<Article> findByCategoryAndIsPublished(String category, Boolean isPublished);
    
    @Query("SELECT a FROM Article a WHERE (LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(a.excerpt) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND a.isPublished = true")
    List<Article> searchByKeyword(@Param("keyword") String keyword);
}
