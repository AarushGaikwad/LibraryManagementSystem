package com.example.LibraryManagementSystem.controller;

import com.example.LibraryManagementSystem.dto.StudentDto;
import com.example.LibraryManagementSystem.dto.UpdateStudentDto;
import com.example.LibraryManagementSystem.entity.LibraryStudent;
import com.example.LibraryManagementSystem.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/{id}")
    public ResponseEntity<LibraryStudent> getStudentById(@PathVariable Long id) {
        return studentService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<LibraryStudent> getAllStudents() {
        return studentService.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<LibraryStudent> updateStudent(@PathVariable Long id,
                                                        @RequestBody UpdateStudentDto dto) {
        LibraryStudent updated = studentService.updateStudent(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
