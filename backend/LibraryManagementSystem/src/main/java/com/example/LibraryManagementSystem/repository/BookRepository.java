package com.example.LibraryManagementSystem.repository;

import com.example.LibraryManagementSystem.entity.LibraryBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookRepository extends JpaRepository<LibraryBook, Long> {

    // Custom query to search for books by title or author
    @Query("SELECT b FROM LibraryBook b WHERE " +
            "LOWER(b.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(b.author) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<LibraryBook> searchBooks(@Param("searchTerm") String searchTerm);
}
