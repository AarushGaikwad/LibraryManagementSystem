package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.entity.LibraryBook;
import com.example.LibraryManagementSystem.repository.BookRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService{

    private final BookRepository bookRepository;

    @Override
    public LibraryBook saveBook(LibraryBook book) {
        return bookRepository.save(book);
    }

    @Override
    public Optional<LibraryBook> findById(Long id) {
        return bookRepository.findById(id);
    }

    @Override
    public List<LibraryBook> findAll() {
        return bookRepository.findAll();
    }

    @Transactional
    @Override
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
}
