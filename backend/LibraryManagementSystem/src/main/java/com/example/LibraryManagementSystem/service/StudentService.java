package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.StudentDto;
import com.example.LibraryManagementSystem.dto.UpdateStudentDto;

public interface StudentService {
    StudentDto updateStudent(Long userId, UpdateStudentDto dto);
}
