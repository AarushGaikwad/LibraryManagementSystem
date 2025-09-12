package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.TransactionDto;

import java.util.List;
import java.util.Optional;

public interface TransactionService {
    TransactionDto borrowBook(Long userId, Long bookId);
    TransactionDto returnBook(Long userId, Long bookId);
    Optional<TransactionDto> findById(Long id);
    List<TransactionDto> findAll();
}
