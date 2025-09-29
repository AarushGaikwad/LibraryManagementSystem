package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.CreateUserDto;
import com.example.LibraryManagementSystem.dto.UserDto;
import com.example.LibraryManagementSystem.entity.LibraryStudent;
import com.example.LibraryManagementSystem.entity.LibraryTeacher;
import com.example.LibraryManagementSystem.entity.LibraryUser;
import com.example.LibraryManagementSystem.repository.StudentRepository;
import com.example.LibraryManagementSystem.repository.TeacherRepository;
import com.example.LibraryManagementSystem.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserDto saveUser(CreateUserDto dto) {

        String hashedPassword = passwordEncoder.encode(dto.getPassword());

        LibraryUser user = LibraryUser.builder()
                .name(dto.getUsername())
                .email(dto.getEmail())
                .password(hashedPassword) // Should hash before saving!
                .role(dto.getRole().toUpperCase())
                .build();
        LibraryUser savedUser = userRepository.save(user);

        if ("TEACHER".equalsIgnoreCase(dto.getRole())) {
            LibraryTeacher teacher = LibraryTeacher.builder()
                    .department(dto.getDepartment())
                    .designation(dto.getDesignation())
                    .user(savedUser)
                    .build();
            teacherRepository.save(teacher);
        } else if ("STUDENT".equalsIgnoreCase(dto.getRole())) {
            LibraryStudent student = LibraryStudent.builder()
                    .branch(dto.getDepartment())
                    .yearOfStudy(dto.getYearOfStudy())
                    .user(savedUser)
                    .build();
            studentRepository.save(student);
        }
        return toUserDto(savedUser);
    }

    @Override
    public Optional<UserDto> findById(Long id) {
        return userRepository.findById(id).map(this::toUserDto);
    }

    @Override
    public List<UserDto> findAll() {
        return userRepository.findAll().stream()
                .map(this::toUserDto).toList();
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public Optional<UserDto> findByEmail(String email) {
        return userRepository.findByEmail(email).map(this::toUserDto);
    }

    @Override
    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    @Override
    public long getUserCount() {
        return userRepository.count();
    }

    private UserDto toUserDto(LibraryUser user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }
}
