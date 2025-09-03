package com.example.LibraryManagementSystem.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Map;

public class SecurityUtils {

    // Get current authenticated user's email
    public static String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName(); // This is the email in our case
        }
        return null;
    }

    // Get current authenticated user's ID
    public static Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getDetails() instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> details = (Map<String, Object>) authentication.getDetails();
            return (Long) details.get("userId");
        }
        return null;
    }

    // Get current authenticated user's role
    public static String getCurrentUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getDetails() instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> details = (Map<String, Object>) authentication.getDetails();
            return (String) details.get("role");
        }
        return null;
    }

    // Get current authenticated user's username
    public static String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getDetails() instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> details = (Map<String, Object>) authentication.getDetails();
            return (String) details.get("username");
        }
        return null;
    }

    // Check if current user has a specific role
    public static boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            String expectedRole = "ROLE_" + role.toUpperCase();
            return authentication.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals(expectedRole));
        }
        return false;
    }

    // Check if current user is admin
    public static boolean isAdmin() {
        return hasRole("ADMIN");
    }

    // Check if current user is student
    public static boolean isStudent() {
        return hasRole("STUDENT");
    }

    // Check if current user is teacher
    public static boolean isTeacher() {
        return hasRole("TEACHER");
    }

    // Check if user is authenticated
    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() &&
                !"anonymousUser".equals(authentication.getPrincipal());
    }

    // Get all authentication details
    @SuppressWarnings("unchecked")
    public static Map<String, Object> getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getDetails() instanceof Map) {
            return (Map<String, Object>) authentication.getDetails();
        }
        return null;
    }
}