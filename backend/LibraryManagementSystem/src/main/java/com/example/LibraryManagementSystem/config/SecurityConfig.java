package com.example.LibraryManagementSystem.config;

import com.example.LibraryManagementSystem.service.CustomUserDetailsService;
import com.example.LibraryManagementSystem.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final BCryptPasswordEncoder passwordEncoder;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF for stateless JWT authentication
                .csrf(AbstractHttpConfigurer::disable)

                // Configure CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Set session management to stateless
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Configure authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - no authentication required
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/actuator/health").permitAll()
                        .requestMatchers("/public/**").permitAll()
                        .requestMatchers("/", "/favicon.ico", "/*.css", "/*.js", "/*.png", "/*.jpg").permitAll()

                        // Admin-only endpoints
                        .requestMatchers(HttpMethod.POST, "/api/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")

                        // Book management - Admin can do everything, others can read
                        .requestMatchers(HttpMethod.POST, "/api/books").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/books/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/books/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/books/**").hasAnyRole("ADMIN", "STUDENT", "TEACHER")

                        // Student management - Admin can do everything, students can read their own data
                        .requestMatchers(HttpMethod.POST, "/api/students").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/students/**").hasAnyRole("ADMIN", "STUDENT")
                        .requestMatchers(HttpMethod.DELETE, "/api/students/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/students/**").hasAnyRole("ADMIN", "STUDENT", "TEACHER")

                        // Teacher management - Admin can do everything, teachers can read their own data
                        .requestMatchers(HttpMethod.POST, "/api/teachers").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/teachers/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/teachers/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/teachers/**").hasAnyRole("ADMIN", "STUDENT", "TEACHER")

                        // Transaction endpoints - All authenticated users can access
                        .requestMatchers("/api/transactions/**").hasAnyRole("ADMIN", "STUDENT", "TEACHER")

                        // All other endpoints require authentication
                        .anyRequest().authenticated()
                )

                // Add JWT filter before UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                // Configure authentication provider
                .authenticationProvider(authenticationProvider())

                // Configure headers - Updated syntax for newer Spring Security versions
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.sameOrigin())
                );

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public GrantedAuthorityDefaults grantedAuthorityDefaults() {
        return new GrantedAuthorityDefaults("");  // It will remove all the ROLE_ prefixes
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow specific origins (configure based on your frontend)
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",    // React default
                "http://localhost:4200",    // Angular default
                "http://localhost:8081",    // Alternative frontend port
                "http://localhost:5173"     // Vite default
        ));

        // Allow specific HTTP methods
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        // Allow specific headers
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));

        // Allow credentials
        configuration.setAllowCredentials(true);

        // Cache preflight response for 1 hour
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}