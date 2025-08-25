package com.example.LibraryManagementSystem.repository;

import com.example.LibraryManagementSystem.entity.LibraryBook;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<LibraryBook, Long> {

    List<LibraryBook> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(String title, String author);

    List<LibraryBook> findByAvailableTrue();

    List<LibraryBook> findByCategoryIgnoreCase(String category);
}
