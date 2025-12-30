package Team.C.Service.Spot.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Data
@Entity
@Table(name="customer")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {
     
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false)
    private String name;

    @Column(unique=true, nullable=false)
    private String email;

    @Column(name = "password", nullable=false)
    private String password;

    @Column(unique=true,nullable=false)
    private String phone;
    @Column(nullable=false)
    private String doorNo;
    @Column(nullable=false)
    private String addressLine;
    @Column(nullable=false)
    private String city;
    @Column(nullable=false)
    private String state;
    @Column(nullable=false)
    private Integer pincode;

    @Column(nullable=true)
    private String country;

    @Column(nullable=true)
    private Double latitude;

    @Column(nullable=true)
    private Double longitude;

    @Column(nullable=true)
    private Boolean verified;

    @Column(nullable=false)
    private String role = "CUSTOMER";

    @CreationTimestamp
    @Column(name = "created_at", nullable=false, updatable=false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable=false)
    private LocalDateTime updatedAt;

    @Lob
    @Column(nullable=true)
    private byte[] profileImage;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean emailVerified = false;
}
