package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.StudentDto;
import com.example.LibraryManagementSystem.dto.UpdateStudentDto;
import com.example.LibraryManagementSystem.entity.LibraryStudent;
import com.example.LibraryManagementSystem.entity.LibraryUser;
import com.example.LibraryManagementSystem.repository.StudentRepository;
import com.example.LibraryManagementSystem.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService{

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    @Override
    @Transactional
    public StudentDto updateStudent(Long userId, UpdateStudentDto dto){
        // Fetch LibraryUser
        LibraryUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch LibraryStudent
        LibraryStudent student = studentRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update LibraryUser fields
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());

        // Update LibraryStudent fields
        student.setYearOfStudy(dto.getYearOfStudy());
        student.setBranch(dto.getBranch());

        // Save both entities
        userRepository.save(user);
        studentRepository.save(student);

        // Convert to DTO and return
        return toStudentDto(user, student);
    }

    private StudentDto toStudentDto(LibraryUser user, LibraryStudent student) {
        StudentDto dto = new StudentDto();
        dto.setUserId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setYearOfStudy(student.getYearOfStudy());
        dto.setBranch(student.getBranch());
        return dto;
    }
}
