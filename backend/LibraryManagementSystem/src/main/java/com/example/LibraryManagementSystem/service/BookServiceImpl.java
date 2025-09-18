package com.example.LibraryManagementSystem.service;

import com.example.LibraryManagementSystem.dto.BookDto;
import com.example.LibraryManagementSystem.dto.CreateBookDto;
import com.example.LibraryManagementSystem.entity.LibraryBook;
import com.example.LibraryManagementSystem.repository.BookRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookServiceImpl implements BookService {
    private final BookRepository bookRepository;

    @Override
    @Transactional
    public BookDto saveBook(CreateBookDto dto) {
        LibraryBook entity = new LibraryBook();
        entity.setTitle(dto.getTitle());
        entity.setAuthor(dto.getAuthor());
        // add other fields
        entity.setAvailable(true);
        LibraryBook saved = bookRepository.save(entity);
        return toBookDto(saved);
    }

    @Override
    public Optional<BookDto> findById(Long id) {
        return bookRepository.findById(id).map(this::toBookDto);
    }

    @Override
    public List<BookDto> findAll() {
        return bookRepository.findAll().stream()
                .map(this::toBookDto).toList();
    }

    @Override
    @Transactional
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    @Override
    public List<BookDto> searchBooks(String searchTerm) {
        log.info("Searching books with term: {}", searchTerm);

        // Return empty list if search term is null, empty, or blank
        if (!StringUtils.hasText(searchTerm)) {
            log.info("Empty search term provided, returning empty list");
            return new ArrayList<>();
        }

        // Trim the search term to remove leading/trailing spaces
        String trimmedSearchTerm = searchTerm.trim();

        // Perform the search
        List<LibraryBook> books = bookRepository.searchBooks(trimmedSearchTerm);
        log.info("Found {} books matching search term: {}", books.size(), trimmedSearchTerm);

        return books.stream()
                .map(this::toBookDto)
                .toList();
    }

    private BookDto toBookDto(LibraryBook book) {
        BookDto dto = new BookDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setAvailable(book.getAvailable());
        return dto;
    }
}
