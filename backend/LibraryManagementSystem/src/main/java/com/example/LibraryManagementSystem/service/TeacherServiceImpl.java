package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.TeacherDto;
import com.example.LibraryManagementSystem.dto.UpdateTeacherDto;
import com.example.LibraryManagementSystem.entity.LibraryTeacher;
import com.example.LibraryManagementSystem.entity.LibraryUser;
import com.example.LibraryManagementSystem.repository.TeacherRepository;
import com.example.LibraryManagementSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

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

    @Override
    public Optional<LibraryTeacher> findById(Long id) {
        return teacherRepository.findById(id);
    }

    @Override
    public List<LibraryTeacher> findAll() {
        return teacherRepository.findAll();
    }

    @Override
    public LibraryTeacher updateTeacher(Long id, UpdateTeacherDto dto) {
        LibraryTeacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher details not found"));

        if (StringUtils.hasText(dto.getDepartment())) {
            teacher.setDepartment(dto.getDepartment());
        }

        if (StringUtils.hasText(dto.getDesignation())) {
            teacher.setDesignation(dto.getDesignation());
        }

        return teacherRepository.save(teacher);
    }

    @Override
    public void deleteTeacher(Long id) {
        teacherRepository.deleteById(id);
    }
}
