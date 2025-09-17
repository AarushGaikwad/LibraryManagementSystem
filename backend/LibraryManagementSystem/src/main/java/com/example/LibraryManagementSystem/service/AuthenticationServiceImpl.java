package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.AuthenticationResponseDto;
import com.example.LibraryManagementSystem.dto.LoginRequestDto;
import com.example.LibraryManagementSystem.dto.LoginResponseDto;
import com.example.LibraryManagementSystem.entity.LibraryUser;
import com.example.LibraryManagementSystem.repository.UserRepository;
import com.example.LibraryManagementSystem.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService{
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public AuthenticationResponseDto login(LoginRequestDto loginRequest) {
        try {
            log.info("Login attempt for email: {}", loginRequest.getEmail());

            //find user by email
            Optional<LibraryUser> optionalUser = userRepository.findByEmail(loginRequest.getEmail());

            if (optionalUser.isEmpty()){
                log.warn("user not found for email: {}", loginRequest.getEmail());
                return AuthenticationResponseDto.failure("Invalid email or password");
            }

            LibraryUser user = optionalUser.get();

            //validate password
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())){
                log.warn("Invalid password for email: {}", loginRequest.getEmail());
                return AuthenticationResponseDto.failure("Invalid email or password");
            }

            //jwt token will be generated here
            String token = jwtUtil.generateToken(
                    user.getId(),
                    user.getEmail(),
                    user.getName(),
                    user.getRole()
            );

            //response will be created here
            LoginResponseDto loginResponse = LoginResponseDto.builder()
                    .token(token)
                    .tokenType("Bearer")
                    .userid(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .authority(user.getRole())
                    .expiresIn(jwtUtil.getTokenValidity())
                    .build();

            log.info("Login successful for user: {} with role: {}", user.getEmail(), user.getRole());
            return AuthenticationResponseDto.success(loginResponse);

        } catch (Exception e) {
            log.error("Login failed for email: {} with error: {}", loginRequest.getEmail(), e.getMessage());
            return AuthenticationResponseDto.failure("Login failed due to server error");
        }
    }
}
