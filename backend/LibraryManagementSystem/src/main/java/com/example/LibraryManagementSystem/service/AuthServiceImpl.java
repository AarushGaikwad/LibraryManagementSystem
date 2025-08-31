package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.ChangePasswordRequest;
import com.example.LibraryManagementSystem.dto.LoginRequest;
import com.example.LibraryManagementSystem.dto.LoginResponse;
import com.example.LibraryManagementSystem.dto.RefreshTokenRequest;
import com.example.LibraryManagementSystem.entity.LibraryStudent;
import com.example.LibraryManagementSystem.entity.LibraryTeacher;
import com.example.LibraryManagementSystem.entity.LibraryUser;
import com.example.LibraryManagementSystem.exception.AuthenticationException;
import com.example.LibraryManagementSystem.exception.FirstLoginException;
import com.example.LibraryManagementSystem.repository.StudentRepository;
import com.example.LibraryManagementSystem.repository.TeacherRepository;
import com.example.LibraryManagementSystem.repository.UserRepository;
import com.example.LibraryManagementSystem.security.JwtUtil;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService{
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public LoginResponse loginStudent(LoginRequest request) {
        log.info("Student login attempt for email: {}", request.getEmail());

        LibraryUser user = authenticateUser(request, "STUDENT");

        // Check if first login
        if (user.requiresPasswordChange()) {
            throw new FirstLoginException("Password change required for first login", user.getId(), user.getEmail());
        }

        // Get student details
        Optional<LibraryStudent> studentOpt = studentRepository.findById(user.getId());

        return buildLoginResponse(user, studentOpt.orElse(null), null);
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse loginTeacher(LoginRequest request) {
        log.info("Teacher login attempt for email: {}", request.getEmail());

        LibraryUser user = authenticateUser(request, "TEACHER");

        // Check if first login
        if (user.requiresPasswordChange()) {
            throw new FirstLoginException("Password change required for first login", user.getId(), user.getEmail());
        }

        // Get teacher details
        Optional<LibraryTeacher> teacherOpt = teacherRepository.findById(user.getId());

        return buildLoginResponse(user, null, teacherOpt.orElse(null));
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse loginAdmin(LoginRequest request) {
        log.info("Admin login attempt for email: {}", request.getEmail());

        LibraryUser user = authenticateUser(request, "ADMIN");

        // Admins typically don't need password change on first login, but check anyway
        if (user.requiresPasswordChange()) {
            throw new FirstLoginException("Password change required for first login", user.getId(), user.getEmail());
        }

        return buildLoginResponse(user, null, null);
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse refreshToken(RefreshTokenRequest request) {
        log.info("Token refresh attempt");

        String refreshToken = request.getRefreshToken();

        if (!jwtUtil.validateRefreshToken(refreshToken)) {
            throw new AuthenticationException("Invalid or expired refresh token");
        }

        // Extract user information from refresh token
        String email = jwtUtil.extractEmail(refreshToken);
        Long userId = jwtUtil.extractUserId(refreshToken);
        String role = jwtUtil.extractRole(refreshToken);

        // Verify user still exists and is active
        LibraryUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenticationException("User not found"));

        // Generate new tokens
        String newAccessToken = jwtUtil.generateToken(userId, user.getName(), email, role);
        String newRefreshToken = jwtUtil.generateRefreshToken(userId, user.getName(), email, role);

        // Build response based on role
        LoginResponse.UserInfo userInfo = LoginResponse.UserInfo.builder()
                .userId(userId)
                .name(user.getName())
                .email(email)
                .role(role)
                .build();

        // Add role-specific information
        if ("STUDENT".equals(role)) {
            studentRepository.findById(userId).ifPresent(student -> {
                userInfo.setStudentInfo(LoginResponse.StudentInfo.builder()
                        .yearOfStudy(student.getYearOfStudy())
                        .branch(student.getBranch())
                        .build());
            });
        } else if ("TEACHER".equals(role)) {
            teacherRepository.findById(userId).ifPresent(teacher -> {
                userInfo.setTeacherInfo(LoginResponse.TeacherInfo.builder()
                        .department(teacher.getDepartment())
                        .designation(teacher.getDesignation())
                        .build());
            });
        }

        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .firstLogin(false) // Refresh means they've already logged in
                .user(userInfo)
                .build();
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        log.info("Password change attempt for user ID: {}", userId);

        // Validate passwords match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AuthenticationException("New password and confirm password do not match");
        }

        // Get user
        LibraryUser user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthenticationException("User not found"));

        // Verify current password (unless it's first login)
        if (!user.requiresPasswordChange()) {
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new AuthenticationException("Current password is incorrect");
            }
        }

        // Validate new password is different from current (optional security measure)
        if (!user.requiresPasswordChange() && passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new AuthenticationException("New password must be different from current password");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.markPasswordChanged();

        userRepository.save(user);

        log.info("Password changed successfully for user ID: {}", userId);
    }

    @Override
    @Transactional(readOnly = true)
    public void validateUserRole(String email, String expectedRole) {
        LibraryUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenticationException("User not found"));

        if (!expectedRole.equalsIgnoreCase(user.getRole())) {
            throw new AuthenticationException("User does not have the required role: " + expectedRole);
        }
    }

    // Private helper methods

    private LibraryUser authenticateUser(LoginRequest request, String expectedRole) {
        // Find user by email
        LibraryUser user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthenticationException("Invalid email or password"));

        // Verify role
        if (!expectedRole.equalsIgnoreCase(user.getRole())) {
            throw new AuthenticationException("User does not have " + expectedRole + " role");
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthenticationException("Invalid email or password");
        }

        log.info("User authenticated successfully: {} with role: {}", user.getEmail(), user.getRole());
        return user;
    }

    private LoginResponse buildLoginResponse(LibraryUser user, LibraryStudent student, LibraryTeacher teacher) {
        // Generate tokens
        String accessToken = jwtUtil.generateToken(user.getId(), user.getName(), user.getEmail(), user.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId(), user.getName(), user.getEmail(), user.getRole());

        // Build user info
        LoginResponse.UserInfo.UserInfoBuilder userInfoBuilder = LoginResponse.UserInfo.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole());

        // Add role-specific information
        if (student != null) {
            userInfoBuilder.studentInfo(LoginResponse.StudentInfo.builder()
                    .yearOfStudy(student.getYearOfStudy())
                    .branch(student.getBranch())
                    .build());
        }

        if (teacher != null) {
            userInfoBuilder.teacherInfo(LoginResponse.TeacherInfo.builder()
                    .department(teacher.getDepartment())
                    .designation(teacher.getDesignation())
                    .build());
        }

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .firstLogin(user.requiresPasswordChange())
                .user(userInfoBuilder.build())
                .build();
    }
}
