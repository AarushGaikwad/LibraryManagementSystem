package com.example.LibraryManagementSystem.entity;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "library_book")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class LibraryBook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String title;

    @Column(nullable=false)
    private String author;

    @Column(columnDefinition = "TEXT")
    private String qrCode;

    @Column(nullable = false)
    private Boolean available = true;
}
