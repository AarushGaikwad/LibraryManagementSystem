package com.example.LibraryManagementSystem.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateStudentDto {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @NotNull(message = "Year of Study is required")
    @Min(value = 1, message = "Year of Study must be at least 1")
    @Max(value = 4, message = "Year of Study must be at most 4")
    private Integer yearOfStudy;

    @NotBlank(message = "Branch is required")
    @Size(max = 50, message = "Branch must not exceed 50 characters")
    private String branch;
}
