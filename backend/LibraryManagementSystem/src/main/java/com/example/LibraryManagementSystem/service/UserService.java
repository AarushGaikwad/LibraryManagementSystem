package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.entity.LibraryUser;

import java.util.List;
import java.util.Optional;

public interface UserService {
    LibraryUser saveUser(LibraryUser user);
    Optional<LibraryUser> findById(Long id);
    List<LibraryUser> findAll();
    Optional<LibraryUser> findByEmail(String email);
    void deleteUser(Long id);
    LibraryUser updateUser(Long id, LibraryUser updatedUser);

}
