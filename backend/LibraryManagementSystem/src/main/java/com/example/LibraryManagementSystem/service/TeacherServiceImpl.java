package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.TeacherDto;
import com.example.LibraryManagementSystem.entity.LibraryTeacher;
import com.example.LibraryManagementSystem.entity.LibraryUser;
import com.example.LibraryManagementSystem.repository.TeacherRepository;
import com.example.LibraryManagementSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService{

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;

    @Override
    public LibraryTeacher createTeacherDetails(TeacherDto dto) {
        // Check user exists
        LibraryUser user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Role check
        if (!"TEACHER".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("User is not a teacher");
        }
        LibraryTeacher teacher = LibraryTeacher.builder()
                .user(user)
                .department(dto.getDepartment())
                .designation(dto.getDesignation())
                .build();
        return teacherRepository.save(teacher);
    }
}
