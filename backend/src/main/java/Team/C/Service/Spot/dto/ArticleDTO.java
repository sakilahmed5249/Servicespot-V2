package Team.C.Service.Spot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleDTO {
    
    private Long id;
    private String title;
    private String content;
    private String excerpt;
    private String image;
    private String author;
    private String category;
    private Boolean isPublished;
    private Date createdAt;
    private Date publishedAt;
    private Date updatedAt;
}
