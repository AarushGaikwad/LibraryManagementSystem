package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.entity.LibraryUser;
import com.example.LibraryManagementSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        LibraryUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        log.info("Loaded user: {} with DB role: {}", user.getEmail(), user.getRole());

        Collection<? extends GrantedAuthority> authorities = getAuthorities(user.getRole());
        log.info("Converted role {} into authorities: {}", user.getRole(), authorities);

        return User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(getAuthorities(user.getRole())) // now uses ROLE_ prefix
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }

    private Collection<? extends GrantedAuthority> getAuthorities(String role) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
        return authorities;
    }
}