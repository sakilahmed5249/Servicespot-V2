package Team.C.Service.Spot.mapper;

import org.springframework.stereotype.Component;
import Team.C.Service.Spot.dto.customer.CustomerRegistrationDTO;
import Team.C.Service.Spot.dto.customer.CustomerResponseDTO;
import Team.C.Service.Spot.dto.customer.CustomerUpdateDTO;
import Team.C.Service.Spot.model.Customer;

import java.util.Base64;

/**
 * Mapper utility for Customer entity-DTO conversions
 */
@Component
public class CustomerMapper {

    /**
     * Convert registration DTO to entity (password NOT set here - handled in
     * service)
     */
    public Customer registrationDtoToEntity(CustomerRegistrationDTO dto) {
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

        return Customer.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .doorNo(dto.getDoorNo())
                .addressLine(dto.getAddressLine())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(dto.getPincode())
                .country(dto.getCountry() != null ? dto.getCountry() : "India")
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .verified(false)
                .role("CUSTOMER")
                .profileImage(profileImageBytes)
                .build();
    }

    /**
     * Convert entity to response DTO (excludes password)
     */
    public CustomerResponseDTO entityToResponseDto(Customer customer) {
        String profileImageBase64 = null;
        if (customer.getProfileImage() != null) {
            profileImageBase64 = "data:image/jpeg;base64," +
                    Base64.getEncoder().encodeToString(customer.getProfileImage());
        }

        return CustomerResponseDTO.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .doorNo(customer.getDoorNo())
                .addressLine(customer.getAddressLine())
                .city(customer.getCity())
                .state(customer.getState())
                .pincode(customer.getPincode())
                .country(customer.getCountry())
                .latitude(customer.getLatitude())
                .longitude(customer.getLongitude())
                .verified(customer.getVerified())
                .role(customer.getRole())
                .profileImage(profileImageBase64)
                .build();
    }

    /**
     * Update entity from update DTO (only non-null fields)
     */
    public void updateEntityFromDto(Customer customer, CustomerUpdateDTO dto) {
        if (dto.getName() != null)
            customer.setName(dto.getName());
        if (dto.getPhone() != null)
            customer.setPhone(dto.getPhone());
        if (dto.getDoorNo() != null)
            customer.setDoorNo(dto.getDoorNo());
        if (dto.getAddressLine() != null)
            customer.setAddressLine(dto.getAddressLine());
        if (dto.getCity() != null)
            customer.setCity(dto.getCity());
        if (dto.getState() != null)
            customer.setState(dto.getState());
        if (dto.getPincode() != null)
            customer.setPincode(dto.getPincode());
        if (dto.getCountry() != null)
            customer.setCountry(dto.getCountry());
        if (dto.getLatitude() != null)
            customer.setLatitude(dto.getLatitude());
        if (dto.getLongitude() != null)
            customer.setLongitude(dto.getLongitude());

        if (dto.getProfileImage() != null && !dto.getProfileImage().isEmpty()) {
            try {
                String base64Data = dto.getProfileImage();
                if (base64Data.contains(",")) {
                    base64Data = base64Data.split(",")[1];
                }
                customer.setProfileImage(Base64.getDecoder().decode(base64Data));
            } catch (IllegalArgumentException ignored) {
            }
        }
    }
}
