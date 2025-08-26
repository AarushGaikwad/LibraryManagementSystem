package com.example.LibraryManagementSystem.controller;

import com.example.LibraryManagementSystem.dto.TeacherDto;
import com.example.LibraryManagementSystem.dto.TeacherResponseDto;
import com.example.LibraryManagementSystem.dto.UpdateTeacherDto;
import com.example.LibraryManagementSystem.entity.LibraryTeacher;
import com.example.LibraryManagementSystem.service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @PostMapping
    public ResponseEntity<TeacherResponseDto> createTeacherDetails(@Valid @RequestBody TeacherDto dto) {
        LibraryTeacher savedDetail = teacherService.createTeacherDetails(dto);
        TeacherResponseDto responseDto = convertToResponseDto(savedDetail);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherResponseDto> getTeacherById(@PathVariable Long id) {
        return teacherService.findById(id)
                .map(this::convertToResponseDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<TeacherResponseDto>> getAllTeachers() {
        List<TeacherResponseDto> teachers = teacherService.findAll()
                .stream()
                .map(this::convertToResponseDto)
                .toList();
        return ResponseEntity.ok(teachers);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeacherResponseDto> updateTeacher(@PathVariable Long id,
                                                            @Valid @RequestBody UpdateTeacherDto dto) {
        LibraryTeacher updatedTeacher = teacherService.updateTeacher(id, dto);
        return ResponseEntity.ok(convertToResponseDto(updatedTeacher));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.noContent().build();
    }

    private TeacherResponseDto convertToResponseDto(LibraryTeacher teacher) {
        TeacherResponseDto dto = new TeacherResponseDto();
        dto.setUserId(teacher.getUserId());
        dto.setName(teacher.getUser().getName());
        dto.setEmail(teacher.getUser().getEmail());
        dto.setRole(teacher.getUser().getRole());
        dto.setDepartment(teacher.getDepartment());
        dto.setDesignation(teacher.getDesignation());
        return dto;
    }
}
