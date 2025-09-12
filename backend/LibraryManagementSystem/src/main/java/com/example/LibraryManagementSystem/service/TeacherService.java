package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.TeacherDto;
import com.example.LibraryManagementSystem.dto.UpdateTeacherDto;

public interface TeacherService {
    TeacherDto updateTeacher(Long userId, UpdateTeacherDto dto);
}
