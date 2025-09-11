package com.example.LibraryManagementSystem.dto;

import lombok.Data;

@Data
public class CreateUserDto {
    private String name;
    private String email;
    private String password;
    private String role;
}
