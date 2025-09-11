package com.example.LibraryManagementSystem.entity;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "library_teacher")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class LibraryTeacher {

    @Id
    private Long userId; // FK to LibraryUser id

    @Column(nullable = false)
    private String department;

    private String designation;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private LibraryUser user;
}
