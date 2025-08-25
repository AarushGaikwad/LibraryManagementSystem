package com.example.LibraryManagementSystem.dto;

import lombok.Data;

@Data
public class UpdateUserDto {

    private String name;
    private String email;
    private String role;
}
