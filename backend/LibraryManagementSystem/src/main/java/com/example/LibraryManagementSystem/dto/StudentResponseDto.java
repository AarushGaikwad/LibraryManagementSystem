package com.example.LibraryManagementSystem.dto;

import lombok.Data;

@Data
public class StudentResponseDto {
    private Long userId;
    private String name;
    private String email;
    private Integer yearOfStudy;
    private String branch;
    private String role;
}
