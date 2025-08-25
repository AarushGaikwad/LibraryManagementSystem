package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.StudentDto;
import com.example.LibraryManagementSystem.entity.LibraryStudent;
import com.example.LibraryManagementSystem.entity.LibraryUser;
import com.example.LibraryManagementSystem.repository.StudentRepository;
import com.example.LibraryManagementSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService{

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    @Override
    public LibraryStudent createStudentDetails(StudentDto dto) {
        // Check user exists
        LibraryUser user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Role check
        if (!"STUDENT".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("User is not a student");
        }
        LibraryStudent student = LibraryStudent.builder()
                .user(user)
                .yearOfStudy(dto.getYearOfStudy())
                .branch(dto.getBranch())
                .build();
        return studentRepository.save(student);
    }
}
