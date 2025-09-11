package com.example.LibraryManagementSystem.entity;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "library_student")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class LibraryStudent {

    @Id
    private Long userId; // FK to LibraryUser id

    @Column(nullable = false)
    private Integer yearOfStudy;

    @Column(nullable = false)
    private String branch;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private LibraryUser user;
}
