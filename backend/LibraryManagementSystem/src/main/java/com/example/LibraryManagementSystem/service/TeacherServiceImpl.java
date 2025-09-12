package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.TeacherDto;
import com.example.LibraryManagementSystem.dto.UpdateTeacherDto;
import com.example.LibraryManagementSystem.entity.LibraryTeacher;
import com.example.LibraryManagementSystem.entity.LibraryUser;
import com.example.LibraryManagementSystem.repository.TeacherRepository;
import com.example.LibraryManagementSystem.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService{

    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;

    @Override
    @Transactional
    public TeacherDto updateTeacher(Long userId, UpdateTeacherDto dto) {
        // Fetch LibraryUser
        LibraryUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch LibraryTeacher
        LibraryTeacher teacher = teacherRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update LibraryUser fields
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());

        // Update LibraryTeacher fields
        teacher.setDepartment(dto.getDepartment());
        teacher.setDesignation(dto.getDesignation());

        // Save both entities
        userRepository.save(user);
        teacherRepository.save(teacher);

        // Convert to DTO and return
        return toTeacherDto(user, teacher);
    }

    private TeacherDto toTeacherDto(LibraryUser user, LibraryTeacher teacher) {
        TeacherDto dto = new TeacherDto();
        dto.setUserId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setDepartment(teacher.getDepartment());
        dto.setDesignation(teacher.getDesignation());
        return dto;
    }
}
