package com.example.LibraryManagementSystem.dto;

import lombok.Data;

@Data
public class UpdateBookDto {

    private String title;
    private String author;
    private String category;
    private Boolean available;
}
