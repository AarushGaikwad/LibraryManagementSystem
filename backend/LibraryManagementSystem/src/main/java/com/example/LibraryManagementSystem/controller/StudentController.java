package com.example.LibraryManagementSystem.controller;

import com.example.LibraryManagementSystem.dto.StudentDto;
import com.example.LibraryManagementSystem.dto.StudentResponseDto;
import com.example.LibraryManagementSystem.dto.UpdateStudentDto;
import com.example.LibraryManagementSystem.entity.LibraryStudent;
import com.example.LibraryManagementSystem.service.StudentService;
import jakarta.validation.Valid;
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
    public ResponseEntity<StudentResponseDto> createStudentDetails(@Valid @RequestBody StudentDto dto) {
        LibraryStudent savedDetail = studentService.createStudentDetails(dto);
        StudentResponseDto responseDto = convertToResponseDto(savedDetail);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDto> getStudentById(@PathVariable Long id) {
        return studentService.findById(id)
                .map(this::convertToResponseDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<StudentResponseDto>> getAllStudents() {
        List<StudentResponseDto> students = studentService.findAll()
                .stream()
                .map(this::convertToResponseDto)
                .toList();
        return ResponseEntity.ok(students);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDto> updateStudent(@PathVariable Long id,
                                                            @Valid @RequestBody UpdateStudentDto dto) {
        LibraryStudent updated = studentService.updateStudent(id, dto);
        return ResponseEntity.ok(convertToResponseDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    private StudentResponseDto convertToResponseDto(LibraryStudent student) {
        StudentResponseDto dto = new StudentResponseDto();
        dto.setUserId(student.getUserId());
        dto.setName(student.getUser().getName());
        dto.setEmail(student.getUser().getEmail());
        dto.setRole(student.getUser().getRole());
        dto.setYearOfStudy(student.getYearOfStudy());
        dto.setBranch(student.getBranch());
        return dto;
    }
}
