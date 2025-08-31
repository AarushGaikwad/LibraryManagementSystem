package com.example.LibraryManagementSystem.repository;

import com.example.LibraryManagementSystem.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    // Find by token value
    Optional<RefreshToken> findByToken(String token);

    // Find by user ID
    List<RefreshToken> findByUserId(Long userId);

    // Find by user ID and device ID
    Optional<RefreshToken> findByUserIdAndDeviceId(Long userId, String deviceId);

    // Find valid tokens by user ID
    @Query("SELECT rt FROM RefreshToken rt WHERE rt.userId = :userId AND rt.isRevoked = false AND rt.expiresAt > :now")
    List<RefreshToken> findValidTokensByUserId(@Param("userId") Long userId, @Param("now") LocalDateTime now);

    // Find expired tokens
    @Query("SELECT rt FROM RefreshToken rt WHERE rt.expiresAt < :now")
    List<RefreshToken> findExpiredTokens(@Param("now") LocalDateTime now);

    // Find revoked tokens
    List<RefreshToken> findByIsRevokedTrue();

    // Delete expired tokens
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiresAt < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);

    // Delete all tokens for a user
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.userId = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);

    // Revoke all tokens for a user
    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.isRevoked = true WHERE rt.userId = :userId")
    void revokeAllByUserId(@Param("userId") Long userId);

    // Check if user has active tokens
    @Query("SELECT COUNT(rt) > 0 FROM RefreshToken rt WHERE rt.userId = :userId AND rt.isRevoked = false AND rt.expiresAt > :now")
    boolean hasActiveTokens(@Param("userId") Long userId, @Param("now") LocalDateTime now);
}
