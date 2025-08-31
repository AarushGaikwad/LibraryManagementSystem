package com.example.LibraryManagementSystem.security;

import com.example.LibraryManagementSystem.config.JwtConfig;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtUtil {

    private final JwtConfig jwtConfig;

    @PostConstruct
    public void init() {
        // Validate JWT configuration on startup
        jwtConfig.validateConfig();
        log.info("JWT configuration validated successfully");
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes());
    }

    // Generate Access Token
    public String generateToken(Long userId, String username, String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);
        claims.put("email", email);
        claims.put("role", role);
        claims.put("tokenType", "ACCESS");

        return createToken(claims, username, jwtConfig.getExpiration());
    }

    // Generate Refresh Token
    public String generateRefreshToken(Long userId, String username, String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);
        claims.put("email", email);
        claims.put("role", role);
        claims.put("tokenType", "REFRESH");

        return createToken(claims, username, jwtConfig.getRefreshExpiration());
    }

    // Create token with claims
    private String createToken(Map<String, Object> claims, String subject, Long expiration) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract username from token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract user ID from token
    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class));
    }

    // Extract role from token
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    // Extract email from token
    public String extractEmail(String token) {
        return extractClaim(token, claims -> claims.get("email", String.class));
    }

    // Extract token type
    public String extractTokenType(String token) {
        return extractClaim(token, claims -> claims.get("tokenType", String.class));
    }

    // Extract expiration date
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Generic method to extract claims
    public <T> T extractClaim(String token, ClaimsResolver<T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.resolve(claims);
    }

    // Extract all claims
    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException | IllegalArgumentException e) {
            log.error("JWT token parsing failed: {}", e.getMessage());
            throw new JwtException("Invalid JWT token");
        }
    }

    // Check if token is expired
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Validate token
    public Boolean validateToken(String token, String username) {
        try {
            final String extractedUsername = extractUsername(token);
            return (extractedUsername.equals(username) && !isTokenExpired(token));
        } catch (JwtException e) {
            log.error("JWT validation failed: {}", e.getMessage());
            return false;
        }
    }

    // Validate refresh token structure (basic JWT validation)
    public Boolean validateRefreshToken(String token) {
        try {
            String tokenType = extractTokenType(token);
            return "REFRESH".equals(tokenType) && !isTokenExpired(token);
        } catch (JwtException e) {
            log.error("Refresh token validation failed: {}", e.getMessage());
            return false;
        }
    }

    // Functional interface for claims resolver
    @FunctionalInterface
    public interface ClaimsResolver<T> {
        T resolve(Claims claims);
    }
}