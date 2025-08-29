package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.entity.LibraryUser;
import com.example.LibraryManagementSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Login method
    public LibraryUser login(String email, String password) {
        LibraryUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Check if first login
        if (user.isFirstLogin()) {
            throw new RuntimeException("Password change required on first login");
        }

        return user;
    }

    // Change password method
    public void changePassword(String email, String newPassword) {
        LibraryUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Encode new password
        user.setPassword(passwordEncoder.encode(newPassword));

        // Mark firstLogin as false after first password change
        if (user.isFirstLogin()) {
            user.setFirstLogin(false);
        }

        userRepository.save(user);
    }
}
