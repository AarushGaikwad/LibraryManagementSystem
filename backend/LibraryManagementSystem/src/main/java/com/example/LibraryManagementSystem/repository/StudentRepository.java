package com.example.LibraryManagementSystem.repository;

import com.example.LibraryManagementSystem.entity.LibraryStudent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<LibraryStudent, Long> {
}
