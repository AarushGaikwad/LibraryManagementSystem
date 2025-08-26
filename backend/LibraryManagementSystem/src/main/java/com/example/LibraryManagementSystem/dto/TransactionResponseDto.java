package com.example.LibraryManagementSystem.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TransactionResponseDto {
    private Long id;
    private Long userId;
    private String userName;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private LocalDate borrowDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private Double fine;
    private String status; // BORROWED, RETURNED, OVERDUE
}
