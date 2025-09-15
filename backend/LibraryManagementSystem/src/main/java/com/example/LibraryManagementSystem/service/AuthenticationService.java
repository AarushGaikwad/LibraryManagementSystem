package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.AuthenticationResponseDto;
import com.example.LibraryManagementSystem.dto.LoginRequestDto;

public interface AuthenticationService {
    AuthenticationResponseDto login(LoginRequestDto loginRequest);
}
