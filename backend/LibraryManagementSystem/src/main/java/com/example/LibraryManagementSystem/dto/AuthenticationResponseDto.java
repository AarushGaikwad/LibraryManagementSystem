package com.example.LibraryManagementSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponseDto {
    private boolean success;
    private String message;
    private LoginResponseDto data;
    private String error;

    public static AuthenticationResponseDto success(LoginResponseDto data) {
        return AuthenticationResponseDto.builder()
                .success(true)
                .message("Login successful")
                .data(data)
                .build();
    }

    public static AuthenticationResponseDto failure(String error) {
        return AuthenticationResponseDto.builder()
                .success(false)
                .message("Login failed")
                .error(error)
                .build();
    }
}
