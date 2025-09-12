package com.example.LibraryManagementSystem.dto;

import lombok.Data;

@Data
public class UpdateTeacherDto {
    private String name;
    private String email;
    private String department;
    private String designation;
}
