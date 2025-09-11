package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.entity.LibraryBook;
import com.example.LibraryManagementSystem.entity.LibraryTransaction;
import com.example.LibraryManagementSystem.entity.LibraryUser;
import com.example.LibraryManagementSystem.repository.BookRepository;
import com.example.LibraryManagementSystem.repository.TransactionRepository;
import com.example.LibraryManagementSystem.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService{

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    private static final int BORROW_DAYS = 14;  //2 week time
    private static final double FINE_PER_DAY = 10;

    @Override
    @Transactional
    public LibraryTransaction borrowBook(Long userId, Long bookId) {
        LibraryUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        LibraryBook book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (!book.getAvailable()) {
            throw new RuntimeException("Book not available");
        }

        book.setAvailable(false);
        bookRepository.save(book);

        LocalDate borrowDate = LocalDate.now();
        LocalDate dueDate = borrowDate.plusDays(BORROW_DAYS);

        LibraryTransaction transaction = LibraryTransaction.builder()
                .user(user)
                .book(book)
                .borrowDate(borrowDate)
                .dueDate(dueDate)
                .build();

        return transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public LibraryTransaction returnBook(Long userId, Long bookId) {
        Optional<LibraryTransaction> optionalTransaction = transactionRepository.findAll().stream()
                .filter(t -> t.getUser().getId().equals(userId)
                        && t.getBook().getId().equals(bookId)
                        && t.getReturnDate() == null)
                .findFirst();

        if (optionalTransaction.isEmpty()) {
            throw new RuntimeException("Active borrow transaction not found");
        }

        LibraryTransaction transaction = optionalTransaction.get();
        LocalDate returnDate = LocalDate.now();
        transaction.setReturnDate(returnDate);

        // Calculate fine
        if (returnDate.isAfter(transaction.getDueDate())) {
            long daysLate = java.time.temporal.ChronoUnit.DAYS.between(transaction.getDueDate(), returnDate);
            transaction.setFine(daysLate * FINE_PER_DAY);
        } else {
            transaction.setFine(0.0);
        }

        LibraryBook book = transaction.getBook();
        book.setAvailable(true);
        bookRepository.save(book);

        return transactionRepository.save(transaction);
    }

    @Override
    public Optional<LibraryTransaction> findById(Long id) {
        return transactionRepository.findById(id);
    }

    @Override
    public List<LibraryTransaction> findAll() {
        return transactionRepository.findAll();
    }

}
