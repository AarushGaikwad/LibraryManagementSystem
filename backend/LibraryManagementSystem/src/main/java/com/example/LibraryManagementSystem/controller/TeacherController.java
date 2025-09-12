package com.example.LibraryManagementSystem.controller;

import com.example.LibraryManagementSystem.dto.TeacherDto;
import com.example.LibraryManagementSystem.dto.UpdateTeacherDto;
import com.example.LibraryManagementSystem.service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @PutMapping("/{id}")
    public ResponseEntity<TeacherDto> updateTeacher(@PathVariable Long id,
                                                    @Valid @RequestBody UpdateTeacherDto updateTeacherDto) {
        TeacherDto updatedTeacher = teacherService.updateTeacher(id, updateTeacherDto);
        return ResponseEntity.ok(updatedTeacher);
    }
}