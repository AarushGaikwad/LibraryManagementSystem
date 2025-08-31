package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.entity.RefreshToken;

public interface RefreshTokenService {

    // Create a new refresh token for a user
    RefreshToken createRefreshToken(Long userId, String token, String deviceId, String ipAddress, String userAgent);

    // Validate a refresh token
    RefreshToken validateRefreshToken(String token);

    // Revoke a specific refresh token
    void revokeRefreshToken(String token);

    // Revoke all tokens for a user
    void revokeAllUserTokens(Long userId);

    // Clean up expired tokens
    void cleanupExpiredTokens();

    // Get device information for a token
    String getDeviceInfo(String token);

    // Check if user has active tokens
    boolean hasActiveTokens(Long userId);
}
