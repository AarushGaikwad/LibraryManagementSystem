package com.example.LibraryManagementSystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "library_user")
public class LibraryUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // ADMIN, STUDENT, TEACHER

    @Column(nullable = false)
    @Builder.Default
    private Boolean firstLogin = true; // Default true for new accounts

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_password_change")
    private LocalDateTime lastPasswordChange;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (firstLogin == null) {
            firstLogin = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper method to mark password as changed
    public void markPasswordChanged() {
        this.firstLogin = false;
        this.lastPasswordChange = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Helper method to check if user needs password change
    public boolean requiresPasswordChange() {
        return this.firstLogin != null && this.firstLogin;
    }
}