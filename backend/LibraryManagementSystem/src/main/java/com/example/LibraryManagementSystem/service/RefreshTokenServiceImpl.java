package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.entity.RefreshToken;
import com.example.LibraryManagementSystem.exception.AuthenticationException;
import com.example.LibraryManagementSystem.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    @Transactional
    public RefreshToken createRefreshToken(Long userId, String token, String deviceId, String ipAddress, String userAgent) {
        log.info("Creating refresh token for user ID: {} on device: {}", userId, deviceId);

        // Generate a unique device ID if not provided
        final String finalDeviceId = (deviceId == null || deviceId.trim().isEmpty()) 
            ? generateDeviceId() 
            : deviceId;

        // Check if user already has a token for this device
        refreshTokenRepository.findByUserIdAndDeviceId(userId, finalDeviceId)
                .ifPresent(existingToken -> {
                    log.info("Revoking existing token for user ID: {} on device: {}", userId, finalDeviceId);
                    existingToken.revoke();
                    refreshTokenRepository.save(existingToken);
                });

        // Create new refresh token
        RefreshToken refreshToken = RefreshToken.builder()
                .token(token)
                .userId(userId)
                .deviceType("LAPTOP") // Default for web-based application
                .deviceId(finalDeviceId)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .expiresAt(LocalDateTime.now().plusDays(7)) // 7 days validity
                .build();

        RefreshToken savedToken = refreshTokenRepository.save(refreshToken);
        log.info("Refresh token created successfully for user ID: {} on device: {}", userId, finalDeviceId);
        
        return savedToken;
    }

    @Override
    @Transactional(readOnly = true)
    public RefreshToken validateRefreshToken(String token) {
        log.debug("Validating refresh token");

        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new AuthenticationException("Invalid refresh token"));

        // Check if token is revoked
        if (refreshToken.getIsRevoked()) {
            log.warn("Attempted to use revoked refresh token for user ID: {}", refreshToken.getUserId());
            throw new AuthenticationException("Refresh token has been revoked");
        }

        // Check if token is expired
        if (refreshToken.isExpired()) {
            log.warn("Attempted to use expired refresh token for user ID: {}", refreshToken.getUserId());
            throw new AuthenticationException("Refresh token has expired");
        }

        // Update last used timestamp
        refreshToken.setLastUsedAt(LocalDateTime.now());
        refreshTokenRepository.save(refreshToken);

        log.debug("Refresh token validated successfully for user ID: {}", refreshToken.getUserId());
        return refreshToken;
    }

    @Override
    @Transactional
    public void revokeRefreshToken(String token) {
        log.info("Revoking refresh token");

        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new AuthenticationException("Invalid refresh token"));

        refreshToken.revoke();
        refreshTokenRepository.save(refreshToken);

        log.info("Refresh token revoked successfully for user ID: {}", refreshToken.getUserId());
    }

    @Override
    @Transactional
    public void revokeAllUserTokens(Long userId) {
        log.info("Revoking all refresh tokens for user ID: {}", userId);

        List<RefreshToken> userTokens = refreshTokenRepository.findByUserId(userId);
        userTokens.forEach(RefreshToken::revoke);
        refreshTokenRepository.saveAll(userTokens);

        log.info("All refresh tokens revoked for user ID: {}", userId);
    }

    @Override
    @Transactional
    public void cleanupExpiredTokens() {
        log.info("Starting cleanup of expired refresh tokens");

        LocalDateTime now = LocalDateTime.now();
        List<RefreshToken> expiredTokens = refreshTokenRepository.findExpiredTokens(now);

        if (!expiredTokens.isEmpty()) {
            refreshTokenRepository.deleteExpiredTokens(now);
            log.info("Cleaned up {} expired refresh tokens", expiredTokens.size());
        } else {
            log.debug("No expired refresh tokens found");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public String getDeviceInfo(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new AuthenticationException("Invalid refresh token"));

        return String.format("Device: %s (ID: %s), IP: %s, Last Used: %s",
                refreshToken.getDeviceType(),
                refreshToken.getDeviceId(),
                refreshToken.getIpAddress(),
                refreshToken.getLastUsedAt());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasActiveTokens(Long userId) {
        return refreshTokenRepository.hasActiveTokens(userId, LocalDateTime.now());
    }

    // Generate a unique device identifier
    private String generateDeviceId() {
        return "LAPTOP_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    // Scheduled task to clean up expired tokens every hour
    @Scheduled(fixedRate = 3600000) // 1 hour in milliseconds
    public void scheduledCleanup() {
        log.debug("Running scheduled cleanup of expired refresh tokens");
        cleanupExpiredTokens();
    }
}
