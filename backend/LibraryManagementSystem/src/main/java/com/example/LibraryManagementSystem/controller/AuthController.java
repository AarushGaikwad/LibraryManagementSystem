package com.example.LibraryManagementSystem.controller;

import com.example.LibraryManagementSystem.dto.ChangePasswordRequest;
import com.example.LibraryManagementSystem.dto.LoginRequest;
import com.example.LibraryManagementSystem.dto.LoginResponse;
import com.example.LibraryManagementSystem.dto.RefreshTokenRequest;
import com.example.LibraryManagementSystem.exception.AuthenticationException;
import com.example.LibraryManagementSystem.exception.FirstLoginException;
import com.example.LibraryManagementSystem.security.JwtUtil;
import com.example.LibraryManagementSystem.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    // Student Login Endpoint
    @PostMapping("/student/login")
    public ResponseEntity<?> loginStudent(@Valid @RequestBody LoginRequest request) {
        try {
            log.info("Student login request received for email: {}", request.getEmail());
            LoginResponse response = authService.loginStudent(request);
            log.info("Student login successful for email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (FirstLoginException e) {
            log.warn("First login detected for student: {}", e.getEmail());
            return handleFirstLoginException(e);
        } catch (AuthenticationException e) {
            log.error("Student authentication failed for email: {} - {}", request.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("AUTHENTICATION_FAILED", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during student login for email: {}", request.getEmail(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("INTERNAL_ERROR", "An unexpected error occurred"));
        }
    }

    // Teacher Login Endpoint
    @PostMapping("/teacher/login")
    public ResponseEntity<?> loginTeacher(@Valid @RequestBody LoginRequest request) {
        try {
            log.info("Teacher login request received for email: {}", request.getEmail());
            LoginResponse response = authService.loginTeacher(request);
            log.info("Teacher login successful for email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (FirstLoginException e) {
            log.warn("First login detected for teacher: {}", e.getEmail());
            return handleFirstLoginException(e);
        } catch (AuthenticationException e) {
            log.error("Teacher authentication failed for email: {} - {}", request.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("AUTHENTICATION_FAILED", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during teacher login for email: {}", request.getEmail(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("INTERNAL_ERROR", "An unexpected error occurred"));
        }
    }

    // Admin Login Endpoint
    @PostMapping("/admin/login")
    public ResponseEntity<?> loginAdmin(@Valid @RequestBody LoginRequest request) {
        try {
            log.info("Admin login request received for email: {}", request.getEmail());
            LoginResponse response = authService.loginAdmin(request);
            log.info("Admin login successful for email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (FirstLoginException e) {
            log.warn("First login detected for admin: {}", e.getEmail());
            return handleFirstLoginException(e);
        } catch (AuthenticationException e) {
            log.error("Admin authentication failed for email: {} - {}", request.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("AUTHENTICATION_FAILED", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during admin login for email: {}", request.getEmail(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("INTERNAL_ERROR", "An unexpected error occurred"));
        }
    }

    // Refresh Token Endpoint
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        try {
            log.info("Token refresh request received");
            LoginResponse response = authService.refreshToken(request);
            log.info("Token refresh successful");
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            log.error("Token refresh failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("TOKEN_REFRESH_FAILED", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during token refresh", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("INTERNAL_ERROR", "An unexpected error occurred"));
        }
    }

    // Change Password Endpoint
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request,
                                            HttpServletRequest httpRequest) {
        try {
            // Extract user ID from JWT token
            Long userId = extractUserIdFromToken(httpRequest);

            log.info("Password change request received for user ID: {}", userId);
            authService.changePassword(userId, request);
            log.info("Password changed successfully for user ID: {}", userId);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            response.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            log.error("Password change failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("PASSWORD_CHANGE_FAILED", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during password change", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("INTERNAL_ERROR", "An unexpected error occurred"));
        }
    }

    // Logout Endpoint (for client-side token cleanup)
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            // Since we're using stateless JWT, logout is handled client-side
            // This endpoint is provided for consistency and potential future enhancements
            Long userId = extractUserIdFromToken(request);
            log.info("Logout request received for user ID: {}", userId);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Logged out successfully");
            response.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error during logout", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("LOGOUT_ERROR", "An error occurred during logout"));
        }
    }

    // Get Current User Info Endpoint
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);

            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("NO_TOKEN", "No authentication token provided"));
            }

            // Extract user information from token
            Long userId = jwtUtil.extractUserId(token);
            String username = jwtUtil.extractUsername(token);
            String email = jwtUtil.extractEmail(token);
            String role = jwtUtil.extractRole(token);

            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("userId", userId);
            userInfo.put("username", username);
            userInfo.put("email", email);
            userInfo.put("role", role);

            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            log.error("Error retrieving current user info", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("USER_INFO_ERROR", "Failed to retrieve user information"));
        }
    }

    // Private helper methods

    private ResponseEntity<?> handleFirstLoginException(FirstLoginException e) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "FIRST_LOGIN_REQUIRED");
        response.put("message", e.getMessage());
        response.put("userId", e.getUserId());
        response.put("email", e.getEmail());
        response.put("requirePasswordChange", true);
        response.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.status(HttpStatus.PRECONDITION_REQUIRED).body(response);
    }

    private Map<String, Object> createErrorResponse(String errorCode, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", errorCode);
        response.put("message", message);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    private Long extractUserIdFromToken(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        if (token == null) {
            throw new AuthenticationException("No authentication token provided");
        }
        return jwtUtil.extractUserId(token);
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}