package com.example.LibraryManagementSystem.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = extractTokenFromRequest(request);
            if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                validateAndSetAuthentication(token, request);
            }
        } catch (JwtException e) {
            log.error("JWT validation failed: {}", e.getMessage());
            handleAuthenticationError(response, "INVALID_TOKEN", "Invalid or expired token");
            return;
        } catch (Exception e) {
            log.error("Authentication filter error: {}", e.getMessage(), e);
            handleAuthenticationError(response, "AUTHENTICATION_ERROR", "Authentication processing failed");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private void validateAndSetAuthentication(String token, HttpServletRequest request) {
        try {
            String email = jwtUtil.extractEmail(token);
            String role = jwtUtil.extractRole(token);
            Long userId = jwtUtil.extractUserId(token);
            String username = jwtUtil.extractUsername(token);

            if (jwtUtil.validateToken(token, email)) {
                // DO NOT prefix role with "ROLE_", use as-is
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role.toUpperCase());

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                Collections.singletonList(authority)
                        );

                Map<String, Object> details = new HashMap<>();
                details.put("userId", userId);
                details.put("username", username);
                details.put("email", email);
                details.put("role", role);
                details.put("remoteAddress", request.getRemoteAddr());
                details.put("userAgent", request.getHeader("User-Agent"));

                authentication.setDetails(details);

                SecurityContextHolder.getContext().setAuthentication(authentication);

                log.debug("Authentication set for user: {} with role: {}", email, role);

            }
        } catch (JwtException e) {
            log.error("Token validation failed: {}", e.getMessage());
            throw e;
        }
    }

    private void handleAuthenticationError(HttpServletResponse response,
                                           String errorCode,
                                           String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", errorCode);
        errorResponse.put("message", message);
        errorResponse.put("timestamp", System.currentTimeMillis());
        errorResponse.put("path", "Authentication Filter");
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        String method = request.getMethod();

        return path.startsWith("/api/auth/") ||
                path.startsWith("/h2-console/") ||
                path.startsWith("/actuator/health") ||
                path.startsWith("/public/") ||
                path.equals("/") ||
                path.endsWith(".css") ||
                path.endsWith(".js") ||
                path.endsWith(".png") ||
                path.endsWith(".jpg") ||
                path.endsWith(".ico");
    }
}
