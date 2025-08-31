package com.example.LibraryManagementSystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 1000)
    private String token;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "device_type", nullable = false)
    private String deviceType = "LAPTOP"; // Default to laptop for web-based app

    @Column(name = "device_id", nullable = false)
    private String deviceId; // Unique identifier for the device

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "is_revoked", nullable = false)
    @Builder.Default
    private Boolean isRevoked = false;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_used_at")
    private LocalDateTime lastUsedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (expiresAt == null) {
            // Set expiration to 7 days from creation
            expiresAt = LocalDateTime.now().plusDays(7);
        }
        if (deviceType == null) {
            deviceType = "LAPTOP";
        }
        if (isRevoked == null) {
            isRevoked = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        lastUsedAt = LocalDateTime.now();
    }

    // Check if token is expired
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    // Check if token is valid (not expired and not revoked)
    public boolean isValid() {
        return !isExpired() && !isRevoked;
    }

    // Revoke token
    public void revoke() {
        this.isRevoked = true;
        this.lastUsedAt = LocalDateTime.now();
    }
}
