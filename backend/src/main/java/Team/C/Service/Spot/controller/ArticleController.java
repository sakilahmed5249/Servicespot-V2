package Team.C.Service.Spot.controller;

import Team.C.Service.Spot.dto.ArticleDTO;
import Team.C.Service.Spot.model.Article;
import Team.C.Service.Spot.services.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ArticleController {
    
    private final ArticleService articleService;
    
    private ArticleDTO mapToDTO(Article article) {
        return ArticleDTO.builder()
                .id(article.getId())
                .title(article.getTitle())
                .content(article.getContent())
                .excerpt(article.getExcerpt())
                .image(article.getImage())
                .author(article.getAuthor())
                .category(article.getCategory())
                .isPublished(article.getIsPublished())
                .createdAt(article.getCreatedAt())
                .publishedAt(article.getPublishedAt())
                .updatedAt(article.getUpdatedAt())
                .build();
    }
    
    private Article mapToEntity(ArticleDTO dto) {
        return Article.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .excerpt(dto.getExcerpt())
                .image(dto.getImage())
                .author(dto.getAuthor())
                .category(dto.getCategory())
                .isPublished(dto.getIsPublished())
                .build();
    }
    
    @GetMapping
    public ResponseEntity<List<ArticleDTO>> getAllArticles() {
        return ResponseEntity.ok(articleService.getAllArticles().stream()
                .map(this::mapToDTO).collect(Collectors.toList()));
    }
    
    @GetMapping("/published")
    public ResponseEntity<List<ArticleDTO>> getPublishedArticles() {
        return ResponseEntity.ok(articleService.getPublishedArticles().stream()
                .map(this::mapToDTO).collect(Collectors.toList()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getArticleById(@PathVariable Long id) {
        return articleService.getArticleById(id)
                .map(article -> ResponseEntity.ok(mapToDTO(article)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ArticleDTO>> getArticlesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(articleService.getArticlesByCategory(category).stream()
                .map(this::mapToDTO).collect(Collectors.toList()));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<ArticleDTO>> searchArticles(@RequestParam String keyword) {
        return ResponseEntity.ok(articleService.searchArticles(keyword).stream()
                .map(this::mapToDTO).collect(Collectors.toList()));
    }
    
    @PostMapping
    public ResponseEntity<ArticleDTO> createArticle(@RequestBody ArticleDTO dto) {
        Article article = mapToEntity(dto);
        Article created = articleService.createArticle(article);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDTO(created));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateArticle(@PathVariable Long id, @RequestBody ArticleDTO dto) {
        Article article = mapToEntity(dto);
        Article updated = articleService.updateArticle(id, article);
        if (updated != null) {
            return ResponseEntity.ok(mapToDTO(updated));
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/publish")
    public ResponseEntity<?> publishArticle(@PathVariable Long id) {
        Article published = articleService.publishArticle(id);
        if (published != null) {
            return ResponseEntity.ok(mapToDTO(published));
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/unpublish")
    public ResponseEntity<?> unpublishArticle(@PathVariable Long id) {
        Article unpublished = articleService.unpublishArticle(id);
        if (unpublished != null) {
            return ResponseEntity.ok(mapToDTO(unpublished));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable Long id) {
        if (articleService.deleteArticle(id)) {
            return ResponseEntity.ok("Article deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}
