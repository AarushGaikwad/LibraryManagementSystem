package com.example.LibraryManagementSystem.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDto {
    private String token;
    private String tokenType;
    private Long userid;
    private String name;
    private String email;
    private String authority; // authority for ADMIN, TEACHER, STUDENT
    private Long expiresIn; //token expiration time
}
