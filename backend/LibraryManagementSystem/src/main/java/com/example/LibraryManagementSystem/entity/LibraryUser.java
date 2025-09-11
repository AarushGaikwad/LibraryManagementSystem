package com.example.LibraryManagementSystem.entity;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "library_user")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class LibraryUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // Stored hashed

    @Column(nullable = false)
    private String role; // ADMIN, STUDENT, TEACHER
}
