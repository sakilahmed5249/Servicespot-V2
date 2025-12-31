package Team.C.Service.Spot.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Team.C.Service.Spot.dto.customer.CustomerLoginDTO;
import Team.C.Service.Spot.dto.customer.CustomerRegistrationDTO;
import Team.C.Service.Spot.dto.customer.CustomerResponseDTO;
import Team.C.Service.Spot.dto.customer.CustomerUpdateDTO;
import Team.C.Service.Spot.exception.DuplicateEmailException;
import Team.C.Service.Spot.exception.DuplicatePhoneException;
import Team.C.Service.Spot.exception.InvalidCredentialsException;
import Team.C.Service.Spot.exception.ResourceNotFoundException;
import Team.C.Service.Spot.mapper.CustomerMapper;
import Team.C.Service.Spot.model.Customer;
import Team.C.Service.Spot.repositery.CustomerRepo;
import Team.C.Service.Spot.service.interfaces.ICustomerService;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of customer service with BCrypt password encryption
 */
@Service("secureCustomerService")
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CustomerServiceImpl implements ICustomerService {

    private final CustomerRepo customerRepo;
    private final PasswordEncoder passwordEncoder;
    private final CustomerMapper customerMapper;

    @Override
    public CustomerResponseDTO registerCustomer(CustomerRegistrationDTO dto) {
        log.info("Registering new customer with email: {}", dto.getEmail());

        // Check email uniqueness
        if (customerRepo.findByEmail(dto.getEmail()).isPresent()) {
            throw new DuplicateEmailException(dto.getEmail());
        }

        // Check phone uniqueness
        if (customerRepo.findByPhone(dto.getPhone()).isPresent()) {
            throw new DuplicatePhoneException(dto.getPhone());
        }

        // Map DTO to entity
        Customer customer = customerMapper.registrationDtoToEntity(dto);

        // Hash password with BCrypt
        customer.setPassword(passwordEncoder.encode(dto.getPassword()));

        // Save to database
        Customer saved = customerRepo.save(customer);
        log.info("Customer registered successfully: {}", saved.getEmail());

        return customerMapper.entityToResponseDto(saved);
    }

    @Override
    public CustomerResponseDTO loginCustomer(CustomerLoginDTO dto) {
        log.info("Login attempt for email: {}", dto.getEmail());

        Customer customer = customerRepo.findByEmail(dto.getEmail())
                .orElseThrow(InvalidCredentialsException::new);

        // Verify password with BCrypt
        if (!passwordEncoder.matches(dto.getPassword(), customer.getPassword())) {
            log.warn("Invalid password attempt for email: {}", dto.getEmail());
            throw new InvalidCredentialsException();
        }

        log.info("Login successful for: {}", dto.getEmail());
        return customerMapper.entityToResponseDto(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponseDTO getCustomerById(Long id) {
        Customer customer = customerRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));
        return customerMapper.entityToResponseDto(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponseDTO getCustomerByEmail(String email) {
        Customer customer = customerRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "email", email));
        return customerMapper.entityToResponseDto(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerResponseDTO> getAllCustomers() {
        return customerRepo.findAll().stream()
                .map(customerMapper::entityToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public CustomerResponseDTO updateCustomer(Long id, CustomerUpdateDTO dto) {
        log.info("Updating customer with id: {}", id);

        Customer customer = customerRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));

        // Check phone uniqueness if changed
        if (dto.getPhone() != null && !dto.getPhone().equals(customer.getPhone())) {
            customerRepo.findByPhone(dto.getPhone()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new DuplicatePhoneException(dto.getPhone());
                }
            });
        }

        // Update only provided fields
        customerMapper.updateEntityFromDto(customer, dto);

        Customer updated = customerRepo.save(customer);
        log.info("Customer updated successfully: {}", updated.getEmail());

        return customerMapper.entityToResponseDto(updated);
    }

    @Override
    public void deleteCustomer(Long id) {
        log.info("Deleting customer with id: {}", id);

        if (!customerRepo.existsById(id)) {
            throw new ResourceNotFoundException("Customer", "id", id);
        }

        customerRepo.deleteById(id);
        log.info("Customer deleted successfully: {}", id);
    }

    @Override
    public void changePassword(Long id, String currentPassword, String newPassword) {
        log.info("Changing password for customer id: {}", id);

        Customer customer = customerRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, customer.getPassword())) {
            throw new InvalidCredentialsException("Current password is incorrect");
        }

        // Hash and set new password
        customer.setPassword(passwordEncoder.encode(newPassword));
        customerRepo.save(customer);

        log.info("Password changed successfully for customer: {}", customer.getEmail());
    }

    @Override
    public CustomerResponseDTO verifyCustomer(Long id) {
        log.info("Verifying customer with id: {}", id);

        Customer customer = customerRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));

        customer.setVerified(true);
        Customer verified = customerRepo.save(customer);

        log.info("Customer verified successfully: {}", verified.getEmail());
        return customerMapper.entityToResponseDto(verified);
    }
}
