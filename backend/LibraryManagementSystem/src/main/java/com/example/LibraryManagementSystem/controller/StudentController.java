package com.example.LibraryManagementSystem.controller;

import com.example.LibraryManagementSystem.dto.StudentDto;
import com.example.LibraryManagementSystem.entity.LibraryStudent;
import com.example.LibraryManagementSystem.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    public ResponseEntity<LibraryStudent> createStudentDetails(@RequestBody StudentDto dto) {
        LibraryStudent savedDetail = studentService.createStudentDetails(dto);
        return ResponseEntity.ok(savedDetail);
    }
}
