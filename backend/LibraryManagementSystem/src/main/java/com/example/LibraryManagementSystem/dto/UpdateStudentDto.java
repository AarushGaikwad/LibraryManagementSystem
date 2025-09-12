package com.example.LibraryManagementSystem.dto;

import lombok.Data;

@Data
public class UpdateStudentDto {
    private String name;
    private String email;
    private Integer yearOfStudy;
    private String branch;
}
