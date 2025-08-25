package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.TeacherDto;
import com.example.LibraryManagementSystem.entity.LibraryTeacher;

public interface TeacherService {
    LibraryTeacher createTeacherDetails(TeacherDto teacherDto);
}
