package com.example.LibraryManagementSystem.data;

import com.example.LibraryManagementSystem.entity.LibraryUser;
import com.example.LibraryManagementSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args){
        String adminEmail = "test@admin.com";

        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            LibraryUser admin = new LibraryUser();
            admin.setName("Test Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("test123"));
            admin.setRole("ADMIN");
            admin.setFirstLogin(false);

            userRepository.save(admin);

            log.info("Default admin created -> email: {} | password: {}", adminEmail, "test123");
        }
        else {
            log.info("admin with email {} already exists", adminEmail);
        }
    }
}
