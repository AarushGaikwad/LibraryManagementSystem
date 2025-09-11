package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.entity.LibraryUser;
import com.example.LibraryManagementSystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;

    @Override
    public LibraryUser saveUser(LibraryUser user) {
        return userRepository.save(user);
    }

    @Override
    public Optional<LibraryUser> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public List<LibraryUser> findAll() {
        return userRepository.findAll();
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
