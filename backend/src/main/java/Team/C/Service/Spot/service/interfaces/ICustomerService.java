package Team.C.Service.Spot.service.interfaces;

import Team.C.Service.Spot.dto.customer.CustomerLoginDTO;
import Team.C.Service.Spot.dto.customer.CustomerRegistrationDTO;
import Team.C.Service.Spot.dto.customer.CustomerResponseDTO;
import Team.C.Service.Spot.dto.customer.CustomerUpdateDTO;

import java.util.List;

/**
 * Interface defining customer operations contract
 */
public interface ICustomerService {

    /**
     * Register a new customer with password encryption
     */
    CustomerResponseDTO registerCustomer(CustomerRegistrationDTO dto);

    /**
     * Authenticate customer with BCrypt password verification
     */
    CustomerResponseDTO loginCustomer(CustomerLoginDTO dto);

    /**
     * Get customer by ID
     */
    CustomerResponseDTO getCustomerById(Long id);

    /**
     * Get customer by email
     */
    CustomerResponseDTO getCustomerByEmail(String email);

    /**
     * Get all customers
     */
    List<CustomerResponseDTO> getAllCustomers();

    /**
     * Update customer profile (partial update supported)
     */
    CustomerResponseDTO updateCustomer(Long id, CustomerUpdateDTO dto);

    /**
     * Delete customer by ID
     */
    void deleteCustomer(Long id);

    /**
     * Change password (requires current password verification)
     */
    void changePassword(Long id, String currentPassword, String newPassword);

    /**
     * Mark customer as verified
     */
    CustomerResponseDTO verifyCustomer(Long id);
}
