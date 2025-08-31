package com.example.LibraryManagementSystem.repository;

import com.example.LibraryManagementSystem.entity.LibraryUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<LibraryUser, Long> {

    // Existing method
    Optional<LibraryUser> findByEmail(String email);

    // Role-based queries
    List<LibraryUser> findByRoleIgnoreCase(String role);

    long countByRoleIgnoreCase(String role);

    // First login queries
    List<LibraryUser> findByFirstLoginTrue();

    @Query("SELECT COUNT(u) FROM LibraryUser u WHERE u.firstLogin = true")
    long countUsersRequiringPasswordChange();

    // Additional utility queries
    @Query("SELECT u FROM LibraryUser u WHERE u.role = :role AND u.firstLogin = true")
    List<LibraryUser> findByRoleAndFirstLoginTrue(@Param("role") String role);

    boolean existsByEmail(String email);
}