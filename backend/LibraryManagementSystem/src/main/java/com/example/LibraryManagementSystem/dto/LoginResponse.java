package com.example.LibraryManagementSystem.dto;

import com.example.LibraryManagementSystem.entity.LibraryUser;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String accessToken;
    private String refreshToken;
    private LibraryUser user;
    private String message;
}
