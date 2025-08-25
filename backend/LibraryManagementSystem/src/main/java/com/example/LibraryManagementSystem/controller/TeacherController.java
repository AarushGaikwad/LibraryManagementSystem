package com.example.LibraryManagementSystem.controller;

import com.example.LibraryManagementSystem.dto.TeacherDto;
import com.example.LibraryManagementSystem.dto.UpdateTeacherDto;
import com.example.LibraryManagementSystem.entity.LibraryTeacher;
import com.example.LibraryManagementSystem.service.TeacherService;
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
    public ResponseEntity<LibraryTeacher> createTeacherDetails(@RequestBody TeacherDto dto) {
        LibraryTeacher savedDetail = teacherService.createTeacherDetails(dto);
        return ResponseEntity.ok(savedDetail);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LibraryTeacher> getTeacherById(@PathVariable Long id) {
        return teacherService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<LibraryTeacher> getAllTeachers() {
        return teacherService.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<LibraryTeacher> updateTeacher(@PathVariable Long id,
                                                        @RequestBody UpdateTeacherDto dto) {
        LibraryTeacher updatedTeacher = teacherService.updateTeacher(id, dto);
        return ResponseEntity.ok(updatedTeacher);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.noContent().build();
    }
}
