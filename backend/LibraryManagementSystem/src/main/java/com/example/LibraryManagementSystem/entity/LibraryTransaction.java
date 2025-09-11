package com.example.LibraryManagementSystem.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "library_transaction")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class LibraryTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private LibraryUser user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "book_id")
    private LibraryBook book;

    @Column(nullable = false)
    private LocalDate borrowDate;

    @Column(nullable = false)
    private LocalDate dueDate;

    private LocalDate returnDate;

    private Double fine;
}
