package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.ChangePasswordRequest;
import com.example.LibraryManagementSystem.dto.LoginRequest;
import com.example.LibraryManagementSystem.dto.LoginResponse;
import com.example.LibraryManagementSystem.dto.RefreshTokenRequest;

public interface AuthService {

    // Role-specific login methods
    LoginResponse loginStudent(LoginRequest request);
    LoginResponse loginTeacher(LoginRequest request);
    LoginResponse loginAdmin(LoginRequest request);

    // Token operations
    LoginResponse refreshToken(RefreshTokenRequest request);

    // Password management
    void changePassword(Long userId, ChangePasswordRequest request);

    // Utility methods
    void validateUserRole(String email, String expectedRole);
}