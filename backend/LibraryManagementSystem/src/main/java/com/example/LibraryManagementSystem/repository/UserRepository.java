package com.example.LibraryManagementSystem.repository;

import com.example.LibraryManagementSystem.entity.LibraryUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<LibraryUser, Long> {
}
