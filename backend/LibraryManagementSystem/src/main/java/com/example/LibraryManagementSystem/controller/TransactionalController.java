package com.example.LibraryManagementSystem.controller;

import com.example.LibraryManagementSystem.dto.TransactionResponseDto;
import com.example.LibraryManagementSystem.entity.LibraryTransaction;
import com.example.LibraryManagementSystem.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionalController {

    private final TransactionService transactionService;

    @PostMapping("/borrow")
    public ResponseEntity<TransactionResponseDto> borrowBook(@RequestParam Long userId,
                                                             @RequestParam Long bookId) {
        LibraryTransaction transaction = transactionService.borrowBook(userId, bookId);
        TransactionResponseDto dto = convertToResponseDto(transaction);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/return")
    public ResponseEntity<TransactionResponseDto> returnBook(@RequestParam Long userId,
                                                             @RequestParam Long bookId) {
        LibraryTransaction transaction = transactionService.returnBook(userId, bookId);
        TransactionResponseDto dto = convertToResponseDto(transaction);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponseDto>> getAllTransactions() {
        List<TransactionResponseDto> transactions = transactionService.findAll()
                .stream()
                .map(this::convertToResponseDto)
                .toList();
        return ResponseEntity.ok(transactions);
    }

    private TransactionResponseDto convertToResponseDto(LibraryTransaction transaction) {
        TransactionResponseDto dto = new TransactionResponseDto();
        dto.setId(transaction.getId());
        dto.setUserId(transaction.getUser().getId());
        dto.setUserName(transaction.getUser().getName());
        dto.setBookId(transaction.getBook().getId());
        dto.setBookTitle(transaction.getBook().getTitle());
        dto.setBookAuthor(transaction.getBook().getAuthor());
        dto.setBorrowDate(transaction.getBorrowDate());
        dto.setDueDate(transaction.getDueDate());
        dto.setReturnDate(transaction.getReturnDate());
        dto.setFine(transaction.getFine());
        dto.setStatus(determineStatus(transaction));
        return dto;
    }

    private String determineStatus(LibraryTransaction transaction) {
        if (transaction.getReturnDate() != null) {
            return "RETURNED";
        } else if (LocalDate.now().isAfter(transaction.getDueDate())) {
            return "OVERDUE";
        } else {
            return "BORROWED";
        }
    }
}
