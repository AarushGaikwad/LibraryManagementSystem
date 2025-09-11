package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.entity.LibraryBook;

import java.util.List;
import java.util.Optional;

public interface BookService {
    LibraryBook saveBook(LibraryBook book);
    Optional<LibraryBook> findById(Long id);
    List<LibraryBook> findAll();
    void deleteBook(Long id);
}
