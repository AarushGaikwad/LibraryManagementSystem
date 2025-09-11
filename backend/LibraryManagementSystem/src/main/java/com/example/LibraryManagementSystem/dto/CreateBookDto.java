package com.example.LibraryManagementSystem.dto;

import lombok.Data;

@Data
public class CreateBookDto {
    private String title;
    private String author;
    private String category;
}
