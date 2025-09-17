package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.CreateUserDto;
import com.example.LibraryManagementSystem.dto.UserDto;
import com.example.LibraryManagementSystem.entity.LibraryUser;
import com.example.LibraryManagementSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public UserDto saveUser(CreateUserDto dto) {

        String hashedPassword = passwordEncoder.encode(dto.getPassword());

        LibraryUser entity = LibraryUser.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(hashedPassword) // Should hash before saving!
                .role(dto.getRole())
                .build();
        LibraryUser saved = userRepository.save(entity);
        return toUserDto(saved);
    }

    @Override
    public Optional<UserDto> findById(Long id) {
        return userRepository.findById(id).map(this::toUserDto);
    }

    @Override
    public List<UserDto> findAll() {
        return userRepository.findAll().stream()
                .map(this::toUserDto).toList();
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public Optional<UserDto> findByEmail(String email) {
        return userRepository.findByEmail(email).map(this::toUserDto);
    }

    @Override
    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    private UserDto toUserDto(LibraryUser user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }
}
