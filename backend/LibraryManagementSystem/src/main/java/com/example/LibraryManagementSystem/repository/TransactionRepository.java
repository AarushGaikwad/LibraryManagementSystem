package com.example.LibraryManagementSystem.repository;

import com.example.LibraryManagementSystem.entity.LibraryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<LibraryTransaction, Long> {

    @Query("SELECT t FROM LibraryTransaction t WHERE t.user.id = :userId AND t.book.id = :bookId AND t.returnDate IS NULL")
    Optional<LibraryTransaction> findActiveTransactionByUserAndBook(@Param("userId") Long userId, @Param("bookId") Long bookId);

    @Query("SELECT t FROM LibraryTransaction t WHERE t.user.id = :userId AND t.returnDate IS NULL")
    List<LibraryTransaction> findActiveTransactionsByUser(@Param("userId") Long userId);

    @Query("SELECT t FROM LibraryTransaction t WHERE t.book.id = :bookId AND t.returnDate IS NULL")
    List<LibraryTransaction> findActiveTransactionsByBook(@Param("bookId") Long bookId);

    @Query("SELECT t FROM LibraryTransaction t WHERE t.returnDate IS NULL")
    List<LibraryTransaction> findAllActiveTransactions();

    @Query("SELECT t FROM LibraryTransaction t WHERE t.dueDate < CURRENT_DATE AND t.returnDate IS NULL")
    List<LibraryTransaction> findOverdueTransactions();
}
