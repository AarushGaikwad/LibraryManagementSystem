package com.example.LibraryManagementSystem.controller;

import com.example.LibraryManagementSystem.dto.CreateUserDto;
import com.example.LibraryManagementSystem.dto.UpdateUserDto;
import com.example.LibraryManagementSystem.dto.UserDto;
import com.example.LibraryManagementSystem.entity.LibraryUser;
import com.example.LibraryManagementSystem.security.SecurityUtils;
import com.example.LibraryManagementSystem.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserDto dto) {
        log.info("Admin creating user with email: {}", dto.getEmail());
        LibraryUser savedUser = userService.saveUser(dto);
        UserDto responseDto = convertToDto(savedUser);
        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/create-with-default-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> createUserWithDefaultPassword(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String role,
            @RequestParam String defaultPassword) {

        log.info("Admin creating user with default password - email: {}, role: {}", email, role);
        LibraryUser savedUser = userService.createUserWithDefaultPassword(name, email, role, defaultPassword);
        UserDto responseDto = convertToDto(savedUser);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (authentication.details['userId'] == #id)")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(this::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.findAll()
                .stream()
                .map(this::convertToDto)
                .toList();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/by-role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getUsersByRole(@PathVariable String role) {
        List<UserDto> users = userService.findUsersByRole(role)
                .stream()
                .map(this::convertToDto)
                .toList();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/count-by-role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> countUsersByRole(@PathVariable String role) {
        long count = userService.countUsersByRole(role);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        response.put("role", count);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/requiring-password-change")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getUsersRequiringPasswordChange() {
        List<UserDto> users = userService.findUsersRequiringPasswordChange()
                .stream()
                .map(this::convertToDto)
                .toList();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (authentication.details['userId'] == #id)")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id,
                                              @Valid @RequestBody UpdateUserDto dto) {

        // If not admin, users can only update their own basic info (not role)
        if (!SecurityUtils.isAdmin() && SecurityUtils.getCurrentUserId().equals(id)) {
            dto.setRole(null); // Prevent role change by non-admin users
        }

        LibraryUser updated = userService.updateUser(id, dto);
        return ResponseEntity.ok(convertToDto(updated));
    }

    @PostMapping("/{id}/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> resetUserPassword(
            @PathVariable Long id,
            @RequestParam String newPassword) {

        log.info("Admin resetting password for user ID: {}", id);
        userService.resetUserPassword(id, newPassword);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset successfully");
        response.put("userId", id.toString());

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        // Prevent admin from deleting themselves
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId != null && currentUserId.equals(id)) {
            throw new RuntimeException("Cannot delete your own account");
        }

        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            return ResponseEntity.status(401).build();
        }

        return userService.findById(currentUserId)
                .map(this::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private UserDto convertToDto(LibraryUser user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        // Note: Password is excluded for security
        // Note: firstLogin flag is excluded from public API for security
        return dto;
    }
}