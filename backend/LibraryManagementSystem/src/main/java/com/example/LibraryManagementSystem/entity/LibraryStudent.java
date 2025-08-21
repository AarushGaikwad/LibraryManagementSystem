package com.example.LibraryManagementSystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "library_student")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LibraryStudent {

    @Id
    private Long userId;

    @Column(nullable = false)
    private Integer yearOfStudy;

    @Column(nullable = false)
    private String branch;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private LibraryUser user;
}
