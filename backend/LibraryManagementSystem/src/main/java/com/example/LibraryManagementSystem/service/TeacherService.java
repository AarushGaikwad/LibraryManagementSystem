package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.TeacherDto;
import com.example.LibraryManagementSystem.dto.UpdateTeacherDto;
import com.example.LibraryManagementSystem.entity.LibraryTeacher;

import java.util.List;
import java.util.Optional;

public interface TeacherService {
    LibraryTeacher createTeacherDetails(TeacherDto teacherDto);

    Optional<LibraryTeacher> findById(Long id);

    List<LibraryTeacher> findAll();

    LibraryTeacher updateTeacher(Long id, UpdateTeacherDto dto);

    void deleteTeacher(Long id);
}
