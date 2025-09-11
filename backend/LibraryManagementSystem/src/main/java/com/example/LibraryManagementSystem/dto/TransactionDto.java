package com.example.LibraryManagementSystem.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TransactionDto {
    private Long id;
    private Long userId;
    private Long bookId;
    private LocalDate borrowDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private Double fine;
}
