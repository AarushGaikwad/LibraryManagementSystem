package com.example.LibraryManagementSystem.repository;

import com.example.LibraryManagementSystem.entity.LibraryUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<LibraryUser, Long> {
    Optional<LibraryUser> findByEmail(String email);
}
