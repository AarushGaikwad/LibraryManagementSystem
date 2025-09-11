package com.example.LibraryManagementSystem.repository;

import com.example.LibraryManagementSystem.entity.LibraryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<LibraryTransaction, Long> {
}
