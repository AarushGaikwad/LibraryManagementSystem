package com.example.LibraryManagementSystem.controller;

import com.example.LibraryManagementSystem.dto.StudentDto;
import com.example.LibraryManagementSystem.dto.UpdateStudentDto;
import com.example.LibraryManagementSystem.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @PutMapping("/{id}")
    public ResponseEntity<StudentDto> updateStudent(@PathVariable Long id,
                                                    @Valid @RequestBody UpdateStudentDto updateStudentDto) {
        StudentDto updatedStudent = studentService.updateStudent(id, updateStudentDto);
        return ResponseEntity.ok(updatedStudent);
    }
}