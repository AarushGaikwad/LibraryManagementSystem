package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.BookDto;
import com.example.LibraryManagementSystem.dto.CreateBookDto;
import com.example.LibraryManagementSystem.entity.LibraryBook;

import java.util.List;
import java.util.Optional;

public interface BookService {
    BookDto saveBook(CreateBookDto dto);
    Optional<BookDto> findById(Long id);
    List<BookDto> findAll();
    void deleteBook(Long id);
    List<BookDto> searchBooks(String searchTerm);
    long countBooks();
}
