package com.example.LibraryManagementSystem.entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "library_teacher" , indexes = {
        @Index(name = "idx_teacher_department", columnList = "department")
})
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class LibraryTeacher {

    @Id
    private Long userId; // FK to LibraryUser id

    @NotBlank(message = "Department is required")
    @Size(max = 50, message = "Department must not exceed 50 characters")
    @Column(nullable = false)
    private String department;

    @Size(max = 50, message = "Designation must not exceed 50 characters")
    private String designation;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private LibraryUser user;
}
