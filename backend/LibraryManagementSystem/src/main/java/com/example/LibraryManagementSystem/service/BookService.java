package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.CreateBookDto;
import com.example.LibraryManagementSystem.dto.UpdateBookDto;
import com.example.LibraryManagementSystem.entity.LibraryBook;

import java.util.List;
import java.util.Optional;

public interface BookService {

    LibraryBook saveBook(CreateBookDto dto);

    Optional<LibraryBook> findById(Long id);

    List<LibraryBook> findAll();
    
    void deleteBook(Long id);

    LibraryBook updateBook(Long id, UpdateBookDto dto);

    List<LibraryBook> searchBooks(String query);

    List<LibraryBook> getAvailableBooks();

    List<LibraryBook> getBooksByCategory(String category);
}
