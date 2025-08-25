package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.StudentDto;
import com.example.LibraryManagementSystem.entity.LibraryStudent;

public interface StudentService {
    LibraryStudent createStudentDetails(StudentDto studentDto);
}
