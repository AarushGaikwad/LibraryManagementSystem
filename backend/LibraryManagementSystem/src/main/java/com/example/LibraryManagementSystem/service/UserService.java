package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.CreateUserDto;
import com.example.LibraryManagementSystem.dto.UpdateUserDto;
import com.example.LibraryManagementSystem.entity.LibraryUser;

import java.util.List;
import java.util.Optional;

public interface UserService {
    LibraryUser saveUser(CreateUserDto dto);
    Optional<LibraryUser> findById(Long id);
    List<LibraryUser> findAll();
    Optional<LibraryUser> findByEmail(String email);
    void deleteUser(Long id);
    LibraryUser updateUser(Long id, UpdateUserDto dto);

}
