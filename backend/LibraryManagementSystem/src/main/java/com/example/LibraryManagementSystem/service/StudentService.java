package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.StudentDto;
import com.example.LibraryManagementSystem.dto.UpdateStudentDto;
import com.example.LibraryManagementSystem.entity.LibraryStudent;

import java.util.List;
import java.util.Optional;

public interface StudentService {
    LibraryStudent createStudentDetails(StudentDto studentDto);

    Optional<LibraryStudent> findById(Long id);

    List<LibraryStudent> findAll();

    LibraryStudent updateStudent(Long id, UpdateStudentDto dto);

    void deleteStudent(Long id);
}
