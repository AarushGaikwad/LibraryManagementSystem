package com.example.LibraryManagementSystem.entity;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "library_transaction" , indexes = {
        @Index(name = "idx_transaction_user", columnList = "user_id"),
        @Index(name = "idx_transaction_book", columnList = "book_id"),
        @Index(name = "idx_transaction_borrow_date", columnList = "borrowDate"),
        @Index(name = "idx_transaction_due_date", columnList = "dueDate"),
        @Index(name = "idx_transaction_return_date", columnList = "returnDate")
})
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class LibraryTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private LibraryUser user;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private LibraryBook book;

    @NotNull(message = "Borrow date is required")
    @Column(nullable = false)
    private LocalDate borrowDate;

    @NotNull(message = "Due date is required")
    @Column(nullable = false)
    private LocalDate dueDate;

    private LocalDate returnDate;

    @DecimalMin(value = "0.0", message = "Fine cannot be negative")
    private Double fine;
}
