package com.example.LibraryManagementSystem.dto;

import lombok.Data;

@Data
public class TeacherResponseDto {
    private Long userId;
    private String name;
    private String email;
    private String department;
    private String designation;
    private String role;
}
