package com.example.LibraryManagementSystem.controller;

import com.example.LibraryManagementSystem.dto.TransactionDto;
import com.example.LibraryManagementSystem.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/borrow")
    public ResponseEntity<TransactionDto> borrowBook(@RequestParam Long userId, @RequestParam Long bookId) {
        TransactionDto transaction = transactionService.borrowBook(userId, bookId);
        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/return")
    public ResponseEntity<TransactionDto> returnBook(@RequestParam Long userId, @RequestParam Long bookId) {
        TransactionDto transaction = transactionService.returnBook(userId, bookId);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping
    public List<TransactionDto> getAllTransactions() {
        return transactionService.findAll();
    }
}
