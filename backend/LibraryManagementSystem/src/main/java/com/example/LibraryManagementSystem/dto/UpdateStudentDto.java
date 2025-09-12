package com.example.LibraryManagementSystem.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateStudentDto {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Year of Study is required")
    @Min(value = 1, message = "Year of Study must be at least 1")
    @Max(value = 4, message = "Year of Study must be at most 4")
    private Integer yearOfStudy;

    @NotBlank(message = "Branch is required")
    private String branch;
}
