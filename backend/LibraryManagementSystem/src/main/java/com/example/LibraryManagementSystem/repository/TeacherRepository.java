package com.example.LibraryManagementSystem.repository;

import com.example.LibraryManagementSystem.entity.LibraryTeacher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository extends JpaRepository<LibraryTeacher, Long> {
}
