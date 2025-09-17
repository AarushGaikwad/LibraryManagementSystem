package com.example.LibraryManagementSystem.config;

import com.example.LibraryManagementSystem.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - no authentication required
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/auth/test").permitAll()

                        // Admin only endpoints
                        .requestMatchers("/api/users/**").hasAuthority("ADMIN")

                        // Book endpoints - different access levels
                        .requestMatchers("GET", "/api/books/**").hasAnyAuthority("ADMIN", "TEACHER", "STUDENT")
                        .requestMatchers("POST", "/api/books").hasAnyAuthority("ADMIN", "TEACHER")
                        .requestMatchers("DELETE", "/api/books/**").hasAuthority("ADMIN")

                        // Transaction endpoints
                        .requestMatchers("/api/transactions/borrow").hasAnyAuthority("STUDENT", "TEACHER")
                        .requestMatchers("/api/transactions/return").hasAnyAuthority("STUDENT", "TEACHER")
                        .requestMatchers("GET", "/api/transactions").hasAnyAuthority("ADMIN", "TEACHER")

                        // Student/Teacher profile endpoints
                        .requestMatchers("/api/students/**").hasAnyAuthority("ADMIN", "STUDENT")
                        .requestMatchers("/api/teachers/**").hasAnyAuthority("ADMIN", "TEACHER")

                        // All other requests need authentication
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}