package com.example.LibraryManagementSystem.controller;

import com.example.LibraryManagementSystem.entity.LibraryTransaction;
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
    public ResponseEntity<LibraryTransaction> borrowBook(@RequestParam Long userId, @RequestParam Long bookId) {
        LibraryTransaction transaction = transactionService.borrowBook(userId, bookId);
        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/return")
    public ResponseEntity<LibraryTransaction> returnBook(@RequestParam Long userId, @RequestParam Long bookId) {
        LibraryTransaction transaction = transactionService.returnBook(userId, bookId);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping
    public List<LibraryTransaction> getAllTransactions() {
        return transactionService.findAll();
    }
}
