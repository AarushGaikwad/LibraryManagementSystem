package com.example.LibraryManagementSystem.controller;

import com.example.LibraryManagementSystem.dto.LoginRequest;
import com.example.LibraryManagementSystem.dto.LoginResponse;
import com.example.LibraryManagementSystem.dto.PasswordChangeRequest;
import com.example.LibraryManagementSystem.entity.LibraryUser;
import com.example.LibraryManagementSystem.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/student/login")
    public ResponseEntity<LoginResponse> studentLogin(@Valid @RequestBody LoginRequest request) {
        LibraryUser user = authService.login(request.getEmail(), request.getPassword());

        // Role validation
        if (!"STUDENT".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.badRequest().body(new LoginResponse(null, null, null,"Invalid role for this login"));
        }

        return ResponseEntity.ok(new LoginResponse(null, null, null,"Login successful"));
    }

    @PostMapping("/teacher/login")
    public ResponseEntity<LoginResponse> teacherLogin(@Valid @RequestBody LoginRequest request) {
        LibraryUser user = authService.login(request.getEmail(), request.getPassword());

        if (!"TEACHER".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.badRequest().body(new LoginResponse(null, null, null,"Invalid role for this login"));
        }

        return ResponseEntity.ok(new LoginResponse(null, null, null,"Login successful"));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<LoginResponse> adminLogin(@Valid @RequestBody LoginRequest request) {
        LibraryUser user = authService.login(request.getEmail(), request.getPassword());

        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.badRequest().body(new LoginResponse(null, null, null,"Invalid role for this login"));
        }

        return ResponseEntity.ok(new LoginResponse(null, null, null,"Login successful"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@Valid @RequestBody PasswordChangeRequest request) {
        authService.changePassword(request.getEmail(), request.getNewPassword());
        return ResponseEntity.ok("Password changed successfully");
    }
}
