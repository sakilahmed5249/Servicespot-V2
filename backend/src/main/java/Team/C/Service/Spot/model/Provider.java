package Team.C.Service.Spot.model;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

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

@Entity
@Table(name="provider")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class Provider {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    

    @Column(name = "name", nullable=false)
    private String name;
    @Column(name = "email", unique=true, nullable=false)
    private String email;
    @Column(name = "password", nullable=false)
    private String password;
    @Column(name = "phone", unique=true,nullable=false)
    private String phone;
    @Column(name = "doorNo", nullable=false)
    private String doorNo;
    @Column(name = "addressLine", nullable=false)
    private String addressLine;
    @Column(name = "city", nullable=false)
    private String city;
    @Column(name = "state", nullable=false)
    private String state; 
    @Column(name = "pincode", nullable=false)
    private Integer pincode;

    @Column(name = "country", nullable=true)
    private String country;

    @Column(name = "serviceType", nullable=false)
    private String serviceType;

    @Column(name = "approxprice", nullable=true, columnDefinition = "FLOAT DEFAULT 0.0")
    private Float price = 0.0f;

    @Column(nullable=true)
    private Double latitude;

    @Column(nullable=true)
    private Double longitude;

    @Column(nullable=true)
    private Boolean verified = false;

    @Column(nullable=false)
    private String role = "PROVIDER";

    @CreationTimestamp
    @Column(name = "created_at", nullable=true, updatable=false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable=true)
    private LocalDateTime updatedAt;

    @Lob
    @Column(nullable=true)
    private byte[] profileImage;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean emailVerified = false;
}
