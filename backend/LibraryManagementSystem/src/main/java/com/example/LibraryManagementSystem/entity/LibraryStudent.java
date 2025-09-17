package com.example.LibraryManagementSystem.entity;

import jakarta.validation.constraints.*;
import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "library_student" , indexes = {
        @Index(name = "idx_student_year", columnList = "yearOfStudy"),
        @Index(name = "idx_student_branch", columnList = "branch")
})
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class LibraryStudent {

    @Id
    private Long userId; // Foreign Key to LibraryUser id

    @NotNull(message = "Year of Study is required")
    @Min(value = 1, message = "Year of Study must be at least 1")
    @Max(value = 4, message = "Year of Study must be at most 4")
    @Column(nullable = false)
    private Integer yearOfStudy;

    @NotBlank(message = "Branch is required")
    @Size(max = 50, message = "Branch must not exceed 50 characters")
    @Column(nullable = false)
    private String branch;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private LibraryUser user;
}
