package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.entity.LibraryTransaction;

import java.util.List;
import java.util.Optional;

public interface TransactionService {
    LibraryTransaction borrowBook(Long userId, Long bookId);
    LibraryTransaction returnBook(Long userId, Long bookId);
    Optional<LibraryTransaction> findById(Long id);
    List<LibraryTransaction> findAll();

}
