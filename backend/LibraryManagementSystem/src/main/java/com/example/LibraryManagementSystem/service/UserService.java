package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.CreateUserDto;
import com.example.LibraryManagementSystem.dto.UserDto;

import java.util.List;
import java.util.Optional;

public interface UserService {
    UserDto saveUser(CreateUserDto dto);
    Optional<UserDto> findById(Long id);
    List<UserDto> findAll();
    void deleteUser(Long id);
}
