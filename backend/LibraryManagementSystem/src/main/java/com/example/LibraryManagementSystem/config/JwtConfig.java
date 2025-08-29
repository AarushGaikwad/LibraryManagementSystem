package com.example.LibraryManagementSystem.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Data
public class JwtConfig {

    @Value("${JWT_SECRET}")
    private String secret;

    @Value("${JWT_EXPIRATION:86400000}") //24 hours
    private Long expiration;

    @Value("${JWT_REFRESH_EXPIRATION:604800000}") //7 days
    private Long refreshExpiration;

    // validation method to ensure secret is properly configured
    public void validateConfig(){
        if (secret == null || secret.trim().isEmpty()) {
            throw new IllegalStateException("JWT_SECRET environment variable is not set or empty");
        }
        if (secret.length() < 32) {
            throw new IllegalStateException("JWT_SECRET must be at least 32 characters long for security");
        }
    }
}
