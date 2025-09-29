package com.example.LibraryManagementSystem.controller;

import com.example.LibraryManagementSystem.dto.BookDto;
import com.example.LibraryManagementSystem.dto.CreateBookDto;
import com.example.LibraryManagementSystem.entity.LibraryBook;
import com.example.LibraryManagementSystem.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Slf4j

public class BookController {
    private final BookService bookService;

    @PostMapping
    public ResponseEntity<BookDto> createBook(@Valid @RequestBody CreateBookDto createBookDto) {
        BookDto savedBook = bookService.saveBook(createBookDto);
        return ResponseEntity.ok(savedBook);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDto> getBookById(@PathVariable Long id) {
        return bookService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<BookDto> getAllBooks() {
        return bookService.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<BookDto>> searchBooks(@RequestParam(required = false) String q) {
        log.info("Search request received with query: {}", q);
        List<BookDto> books = bookService.searchBooks(q);
        log.info("Returning {} books for search query: {}", books.size(), q);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getBooksCount() {
        long total = bookService.countBooks();
        return ResponseEntity.ok(Map.of("totalBooks", total));
    }
}

