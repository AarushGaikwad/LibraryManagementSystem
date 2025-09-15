package com.example.LibraryManagementSystem.controller;

import com.example.LibraryManagementSystem.dto.AuthenticationResponseDto;
import com.example.LibraryManagementSystem.dto.LoginRequestDto;
import com.example.LibraryManagementSystem.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        log.info("Login request received for email: {}", loginRequest.getEmail());

        AuthenticationResponseDto response = authenticationService.login(loginRequest);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Authentication endpoint is working!!");
    }
}
