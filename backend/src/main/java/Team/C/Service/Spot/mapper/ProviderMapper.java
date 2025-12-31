package Team.C.Service.Spot.mapper;

import org.springframework.stereotype.Component;
import Team.C.Service.Spot.dto.provider.ProviderRegistrationDTO;
import Team.C.Service.Spot.dto.provider.ProviderResponseDTO;
import Team.C.Service.Spot.dto.provider.ProviderUpdateDTO;
import Team.C.Service.Spot.model.Provider;

import java.util.Base64;

/**
 * Mapper utility for Provider entity-DTO conversions
 */
@Component
public class ProviderMapper {

    /**
     * Convert registration DTO to entity (password NOT set here - handled in
     * service)
     */
    public Provider registrationDtoToEntity(ProviderRegistrationDTO dto) {
        byte[] profileImageBytes = null;
        if (dto.getProfileImage() != null && !dto.getProfileImage().isEmpty()) {
            try {
                String base64Data = dto.getProfileImage();
                if (base64Data.contains(",")) {
                    base64Data = base64Data.split(",")[1];
                }
                profileImageBytes = Base64.getDecoder().decode(base64Data);
            } catch (IllegalArgumentException e) {
                profileImageBytes = null;
            }
        }

        return Provider.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .doorNo(dto.getDoorNo())
                .addressLine(dto.getAddressLine())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(dto.getPincode())
                .country(dto.getCountry() != null ? dto.getCountry() : "India")
                .serviceType(dto.getServiceType())
                .price(dto.getPrice() != null ? dto.getPrice() : 0.0f)
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .verified(false)
                .role("PROVIDER")
                .profileImage(profileImageBytes)
                .build();
    }

    /**
     * Convert entity to response DTO (excludes password)
     */
    public ProviderResponseDTO entityToResponseDto(Provider provider) {
        String profileImageBase64 = null;
        if (provider.getProfileImage() != null) {
            profileImageBase64 = "data:image/jpeg;base64," +
                    Base64.getEncoder().encodeToString(provider.getProfileImage());
        }

        return ProviderResponseDTO.builder()
                .id(provider.getId())
                .name(provider.getName())
                .email(provider.getEmail())
                .phone(provider.getPhone())
                .doorNo(provider.getDoorNo())
                .addressLine(provider.getAddressLine())
                .city(provider.getCity())
                .state(provider.getState())
                .pincode(provider.getPincode())
                .country(provider.getCountry())
                .serviceType(provider.getServiceType())
                .price(provider.getPrice())
                .latitude(provider.getLatitude())
                .longitude(provider.getLongitude())
                .verified(provider.getVerified())
                .role(provider.getRole())
                .profileImage(profileImageBase64)
                .build();
    }

    /**
     * Update entity from update DTO (only non-null fields)
     */
    public void updateEntityFromDto(Provider provider, ProviderUpdateDTO dto) {
        if (dto.getName() != null)
            provider.setName(dto.getName());
        if (dto.getPhone() != null)
            provider.setPhone(dto.getPhone());
        if (dto.getDoorNo() != null)
            provider.setDoorNo(dto.getDoorNo());
        if (dto.getAddressLine() != null)
            provider.setAddressLine(dto.getAddressLine());
        if (dto.getCity() != null)
            provider.setCity(dto.getCity());
        if (dto.getState() != null)
            provider.setState(dto.getState());
        if (dto.getPincode() != null)
            provider.setPincode(dto.getPincode());
        if (dto.getCountry() != null)
            provider.setCountry(dto.getCountry());
        if (dto.getServiceType() != null)
            provider.setServiceType(dto.getServiceType());
        if (dto.getPrice() != null)
            provider.setPrice(dto.getPrice());
        if (dto.getLatitude() != null)
            provider.setLatitude(dto.getLatitude());
        if (dto.getLongitude() != null)
            provider.setLongitude(dto.getLongitude());

        if (dto.getProfileImage() != null && !dto.getProfileImage().isEmpty()) {
            try {
                String base64Data = dto.getProfileImage();
                if (base64Data.contains(",")) {
                    base64Data = base64Data.split(",")[1];
                }
                provider.setProfileImage(Base64.getDecoder().decode(base64Data));
            } catch (IllegalArgumentException ignored) {
            }
        }
    }
}
