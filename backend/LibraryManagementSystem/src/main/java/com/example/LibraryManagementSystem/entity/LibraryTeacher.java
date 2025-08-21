package com.example.LibraryManagementSystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "library_teacher")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LibraryTeacher {

    @Id
    private Long userId;

    @Column(nullable = false)
    private String department;

    private String designation;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private LibraryUser user;
}
