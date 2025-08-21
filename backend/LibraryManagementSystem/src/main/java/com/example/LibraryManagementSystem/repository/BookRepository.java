package com.example.LibraryManagementSystem.repository;

import com.example.LibraryManagementSystem.entity.LibraryBook;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<LibraryBook, Long> {
}
