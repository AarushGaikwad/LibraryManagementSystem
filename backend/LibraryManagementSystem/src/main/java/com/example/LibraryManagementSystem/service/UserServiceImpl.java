package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.CreateUserDto;
import com.example.LibraryManagementSystem.dto.UpdateUserDto;
import com.example.LibraryManagementSystem.entity.LibraryUser;
import com.example.LibraryManagementSystem.repository.TransactionRepository;
import com.example.LibraryManagementSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    @Override
    public LibraryUser saveUser(CreateUserDto dto) {
        LibraryUser user = LibraryUser.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(dto.getPassword()) // In real app, hash the password
                .role(dto.getRole())
                .build();
        return userRepository.save(user);
    }

    @Override
    public Optional<LibraryUser> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public List<LibraryUser> findAll() {
        return userRepository.findAll();
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public Optional<LibraryUser> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public LibraryUser updateUser(Long id, UpdateUserDto dto) {
        LibraryUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (StringUtils.hasText(dto.getName())) {
            user.setName(dto.getName());
        }
        if (StringUtils.hasText(dto.getEmail())) {
            user.setEmail(dto.getEmail());
        }
        if (StringUtils.hasText(dto.getRole())) {
            user.setRole(dto.getRole());
        }

        return userRepository.save(user);
    }
}