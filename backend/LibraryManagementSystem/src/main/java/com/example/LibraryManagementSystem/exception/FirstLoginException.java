package com.example.LibraryManagementSystem.exception;

import lombok.Getter;

@Getter
public class FirstLoginException extends RuntimeException{

    private final Long userId;
    private final String email;

    public FirstLoginException(String message, Long userId, String email){
        super(message);
        this.userId = userId;
        this.email = email;
    }
}
