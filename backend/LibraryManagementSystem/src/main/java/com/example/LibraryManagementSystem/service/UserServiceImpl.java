package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.CreateUserDto;
import com.example.LibraryManagementSystem.dto.UpdateUserDto;
import com.example.LibraryManagementSystem.entity.LibraryUser;
import com.example.LibraryManagementSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public LibraryUser saveUser(CreateUserDto dto) {
        log.info("Creating new user with email: {}", dto.getEmail());

        // Check if user already exists
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("User with email " + dto.getEmail() + " already exists");
        }

        // Validate role
        validateRole(dto.getRole());

        // Create user entity with encrypted password
        LibraryUser user = LibraryUser.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword())) // Encrypt password
                .role(dto.getRole().toUpperCase())
                .firstLogin(true) // New users must change password on first login
                .build();

        LibraryUser savedUser = userRepository.save(user);
        log.info("User created successfully with ID: {} and email: {}", savedUser.getId(), savedUser.getEmail());

        return savedUser;
    }

    @Override
    @Transactional
    public LibraryUser createUserWithDefaultPassword(String name, String email, String role, String defaultPassword) {
        log.info("Creating user with default password - email: {}, role: {}", email, role);

        // Check if user already exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("User with email " + email + " already exists");
        }

        // Validate role
        validateRole(role);

        // Create user with default password (admin-specified)
        LibraryUser user = LibraryUser.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(defaultPassword)) // Encrypt default password
                .role(role.toUpperCase())
                .firstLogin(true) // Force password change on first login
                .build();

        LibraryUser savedUser = userRepository.save(user);
        log.info("User with default password created successfully - ID: {}, email: {}",
                savedUser.getId(), savedUser.getEmail());

        return savedUser;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<LibraryUser> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LibraryUser> findAll() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        log.info("Deleting user with ID: {}", id);

        LibraryUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        // Check if user has any active transactions before deletion
        // This is a business logic check - you might want to prevent deletion if user has active books

        userRepository.deleteById(id);
        log.info("User deleted successfully - ID: {}, email: {}", id, user.getEmail());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<LibraryUser> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    @Transactional
    public LibraryUser updateUser(Long id, UpdateUserDto dto) {
        log.info("Updating user with ID: {}", id);

        LibraryUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        boolean updated = false;

        // Update name if provided
        if (StringUtils.hasText(dto.getName()) && !dto.getName().equals(user.getName())) {
            user.setName(dto.getName());
            updated = true;
            log.debug("Updated name for user ID: {}", id);
        }

        // Update email if provided
        if (StringUtils.hasText(dto.getEmail()) && !dto.getEmail().equals(user.getEmail())) {
            // Check if new email is already taken
            Optional<LibraryUser> existingUser = userRepository.findByEmail(dto.getEmail());
            if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
                throw new RuntimeException("Email " + dto.getEmail() + " is already taken by another user");
            }
            user.setEmail(dto.getEmail());
            updated = true;
            log.debug("Updated email for user ID: {}", id);
        }

        // Update role if provided
        if (StringUtils.hasText(dto.getRole()) && !dto.getRole().equalsIgnoreCase(user.getRole())) {
            validateRole(dto.getRole());
            user.setRole(dto.getRole().toUpperCase());
            updated = true;
            log.debug("Updated role for user ID: {}", id);
        }

        if (updated) {
            LibraryUser savedUser = userRepository.save(user);
            log.info("User updated successfully - ID: {}, email: {}", savedUser.getId(), savedUser.getEmail());
            return savedUser;
        } else {
            log.debug("No changes detected for user ID: {}", id);
            return user;
        }
    }

    @Override
    @Transactional
    public void resetUserPassword(Long userId, String newPassword) {
        log.info("Resetting password for user ID: {}", userId);

        LibraryUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Encrypt the new password
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setFirstLogin(true); // Force password change on next login

        userRepository.save(user);
        log.info("Password reset successfully for user ID: {}", userId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean verifyPassword(Long userId, String rawPassword) {
        LibraryUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LibraryUser> findUsersByRole(String role) {
        validateRole(role);
        return userRepository.findByRoleIgnoreCase(role);
    }

    @Override
    @Transactional(readOnly = true)
    public long countUsersByRole(String role) {
        validateRole(role);
        return userRepository.countByRoleIgnoreCase(role);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LibraryUser> findUsersRequiringPasswordChange() {
        return userRepository.findByFirstLoginTrue();
    }

    // Private helper methods

    private void validateRole(String role) {
        if (!StringUtils.hasText(role)) {
            throw new IllegalArgumentException("Role cannot be null or empty");
        }

        String upperRole = role.toUpperCase();
        if (!upperRole.equals("ADMIN") && !upperRole.equals("TEACHER") && !upperRole.equals("STUDENT")) {
            throw new IllegalArgumentException("Invalid role: " + role + ". Valid roles are: ADMIN, TEACHER, STUDENT");
        }
    }
}