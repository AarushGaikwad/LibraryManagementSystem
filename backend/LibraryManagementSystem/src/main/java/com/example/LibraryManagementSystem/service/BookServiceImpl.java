package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.UpdateBookDto;
import com.example.LibraryManagementSystem.entity.LibraryBook;
import com.example.LibraryManagementSystem.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

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

    @Override
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    @Override
    public LibraryBook updateBook(Long id, UpdateBookDto dto) {
        LibraryBook book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (StringUtils.hasText(dto.getTitle())) {
            book.setTitle(dto.getTitle());
        }
        if (StringUtils.hasText(dto.getAuthor())) {
            book.setAuthor(dto.getAuthor());
        }
        if (StringUtils.hasText(dto.getCategory())) {
            book.setCategory(dto.getCategory());
        }
        if (dto.getAvailable() != null) {
            book.setAvailable(dto.getAvailable());
        }
        return bookRepository.save(book);
    }

    @Override
    public List<LibraryBook> searchBooks(String query) {
        // Simple example: search by title or author containing query (case insensitive)
        return bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(query, query);
    }

    @Override
    public List<LibraryBook> getAvailableBooks() {
        return bookRepository.findByAvailableTrue();
    }

    @Override
    public List<LibraryBook> getBooksByCategory(String category) {
        return bookRepository.findByCategoryIgnoreCase(category);
    }
}
