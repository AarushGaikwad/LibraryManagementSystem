package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.CreateUserDto;
import com.example.LibraryManagementSystem.dto.UpdateUserDto;
import com.example.LibraryManagementSystem.entity.LibraryUser;

import java.util.List;
import java.util.Optional;

public interface UserService {

    // Basic CRUD operations
    LibraryUser saveUser(CreateUserDto dto);
    Optional<LibraryUser> findById(Long id);
    List<LibraryUser> findAll();
    Optional<LibraryUser> findByEmail(String email);
    void deleteUser(Long id);
    LibraryUser updateUser(Long id, UpdateUserDto dto);

    // Password management methods
    LibraryUser createUserWithDefaultPassword(String name, String email, String role, String defaultPassword);
    void resetUserPassword(Long userId, String newPassword);
    boolean verifyPassword(Long userId, String rawPassword);

    // Role-based queries
    List<LibraryUser> findUsersByRole(String role);
    long countUsersByRole(String role);

    // First login management
    List<LibraryUser> findUsersRequiringPasswordChange();
}