package com.example.LibraryManagementSystem.controller;

import com.example.LibraryManagementSystem.entity.LibraryUser;
import com.example.LibraryManagementSystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    //this method is used to add the library user by accepting the json body
    @PostMapping
    public ResponseEntity<LibraryUser> createUser(@RequestBody LibraryUser user){
        LibraryUser savedUser = userService.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LibraryUser> getUserById(@PathVariable Long id){
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<LibraryUser>> getAllUsers() {
        List<LibraryUser> users = userService.findAll();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<LibraryUser> updateUser(@PathVariable Long id, @RequestBody LibraryUser updatedUser) {
        LibraryUser user = userService.updateUser(id, updatedUser);
        return ResponseEntity.ok(user);
    }
}
