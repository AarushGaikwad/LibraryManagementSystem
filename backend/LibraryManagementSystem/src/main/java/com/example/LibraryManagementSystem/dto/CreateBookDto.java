package com.example.LibraryManagementSystem.dto;

import lombok.Data;

@Data
public class CreateBookDto {  //use for the inputs from the user

    private String title;
    private String author;
}
